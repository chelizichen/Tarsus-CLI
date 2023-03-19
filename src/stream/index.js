const { readFileSync } = require("fs");

/**
 * *********************************************
 * @link Tarsus-CLI https://github.com/chelizichen/Tarsus-CLI
 * @author chelizichen<1347290221@qq.com>
 * @extends TarsusFarameWork https://github.com/chelizichen/TarsusFrameWork
 * @version 1.0.0
 * @description {
 *     从 *.taro 文件中直接解析对应的结构体
 * 在参数通过Http请求传送给微服务网关时
 * 对数据进行验证，如有错误直接返回
 * 对缺少的参数进行默认参数设置
 * }
 * **********************************************
 */

var TarsusStream = function (url) {
  TarsusStream.struct_map = new Map();
  TarsusStream.base_struct = ["int", "string", "bool"];
  TarsusStream.object_struct = ["List", "Set"];

  this._stream = readFileSync(url, "utf-8")
    .trim()
    .replace(/\/\/.*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ");

  let body = new RegExp(/struct(.*)};/g); // 正则1 拿到 结构体数据
  let match = body.exec(this._stream);

  let struct = new RegExp(/struct (.*?){ /s); // 正则2 拿到 结构体名称

  this._struct_name = struct.exec(match)[1]; // 没有做trim

  let struct_match_body = match[1].split(this._struct_name + "{")[1];

  this._data = struct_match_body
    .split("};")
    .filter((v) => v)
    .map((e) => e + "}")
    .map((e) => e.trim());

  this._data.pop();


  this.readStruct();
};

/**
 * 删除注释
 * @param {string} str 需要删除注释的字符串
 * @returns {string} 删除注释后的字符串
 * @deprecated 弃用
 */
TarsusStream.removeComment = function (str) {
  return str.replace(/\/\/\s*([\u4e00-\u9fa5\w]+)\s*/g, "");
};

TarsusStream.prototype.readStruct = function () {
  this._data.forEach((el) => {
    this._read_struct_(el);
  });
};

TarsusStream.prototype._read_struct_ = function (struct) {
  let struct_name_reg = new RegExp(/(.*){/);
  let struct_name = struct_name_reg.exec(struct)[1].split(":")[0].trim();
  let types_reg = new RegExp(/{(.*)}/);
  let types = types_reg
    .exec(struct)[1]
    .split(";")
    .filter((v) => v.trim().length)
    .map((v) => v.trim());

  let regex = /^(\d+)\s+([\w\s]+)\s+:\s/;
  let type_regx = /\:(.*)/;
  let struct_type = types.map((item) => {
    // console.log("item ->>",item);
    const matchs = regex.exec(item);
    const [, index, param] = matchs;
    const type = type_regx.exec(item)[1];
    return {
      index: index.trim(),
      param: param.trim(),
      type: type.trim(),
    };
  });
  struct_type = struct_type.sort((a, b) => a.index - b.index);

  TarsusStream.struct_map.set(struct_name, struct_type);
};

TarsusStream.parse = function (body) {
  let { req, data } = body;
  let struct = TarsusStream.struct_map.get(req);
  let _data = {};
  struct.forEach((item) => {
    const isObject = TarsusStream.check_object_type(
      data[item.param],
      item.type
    );
    // 是否为复杂类型
    if (isObject) {
      _data[item.param] = isObject;
    } else {
      // 为基础类型
      let check_type = TarsusStream.check_type(data[item.param], item.type);
      // console.log("check_type",check_type);
      if (check_type !== undefined) {
        _data[item.param] = check_type;
      } else {
        throw new TypeError(`${data[item.param]} is not typeof ${item.type}`);
      }
    }
  });
  return _data;
};

TarsusStream.check_type = function (value, type) {
  let is_base_type = TarsusStream.base_struct.indexOf(type) > -1;
  if (is_base_type) {
    if (value == undefined || value == null) {
      switch (type) {
        case "int": {
          return 0;
        }
        case "string": {
          return "";
        }
        case "bool": {
          return false;
        }
        default: {
          return undefined;
        }
      }
    }
    switch (type) {
      case "int": {
        if (typeof value == "number") return value;
        return undefined;
      }
      case "string": {
        if (typeof value == "string") return value;
        return undefined;
      }
      case "bool": {
        if (typeof value == "boolean") return value;
        return undefined;
      }
      default: {
        return undefined;
      }
    }
  }
  return undefined;
};
/**
 * @description
 * 首先判断 Type
 * 1、 如果为 List 但长度为空，则赋值[]
 * 2、 判断是否为 Map ，如果是则将Map里全部赋值
 */
TarsusStream.check_object_type = function (data, type) {
  let match_reg = /<(.*)>/;
  let req = "";
  let T = ""; // 泛型
  // 是否为复杂类型
  let is_object_type = TarsusStream.base_struct.indexOf(type) == -1;
  if (is_object_type) {
    // 是否为List 之类的
    let is_object_type = TarsusStream.object_struct.some((item) => {
      return (type.startsWith(item) && !req
        ? (req = match_reg.exec(type)[1])
        : "") && !T
        ? (T = item)
        : "";
    });
    if (is_object_type) {
      if (T == "List" || T == "Set") {
        if (T == "Set") {
          data = Array.from(new Set(data));
        }

        if (TarsusStream.base_struct.indexOf(req) > -1) {
          let is_type_available = data.every((item) =>
            TarsusStream.check_type(item, req)
          );
          if (is_type_available) return data;
          return [];
        } else {
          let ret = data.map((el) => {
            let body = {
              req,
              data: el,
            };
            return TarsusStream.parse(body);
          });
          return ret;
        }
      }
    } else {
      let body = {
        req: type,
        data: data || {},
      };
      let _data = TarsusStream.parse(body);
      return _data;
    }
  }
  return null;
};

module.exports = {
  TarsusStream,
};
