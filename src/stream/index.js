const { readFileSync } = require("fs");
const { TaroError } = require("./err")

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

var TarsusStream = function (url,options) {

  this.readStruct = TarsusStream.prototype.readStruct.bind(this)
  this._read_struct_ = TarsusStream.prototype._read_struct_.bind(this)

  if(!TarsusStream.struct_map){
    TarsusStream.struct_map = new Map();
  }
  TarsusStream.base_struct = ["int", "string", "bool"];
  TarsusStream.object_struct = ["List", "Set"];

  // 自定义的结构体类型
  TarsusStream.define_structs = {}

  // 判断是不是webpack
  let _stream_data = undefined;
  if(options && options.isLoader){
    _stream_data = url; // 是loader 直接使用文件
  }else{
    _stream_data = readFileSync(url,"utf-8")

  }

  this._stream = _stream_data
    .trim()
    .replace(/\/\/.*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ");

  let spl = this._stream.split("interface")
  this._struct_stream = spl[0];
  this._interface_stream = "interface" + spl[1]

  let body = new RegExp(/struct(.*)};/g); // 正则1 拿到 结构体数据
  let match = body.exec(this._struct_stream);

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

  // 添加 interFace 支持
  // 计划添加
  let interFace_body_reg = /interface(.*?)};/
  let interFace_body = interFace_body_reg.exec(this._interface_stream)
  if (interFace_body) {
    interFace_body = interFace_body[1].split("{")[1]

    let interFace_name_reg = /interface(.*){/
    this._interFace_name = interFace_name_reg.exec(this._interface_stream)[1]

    this._interFace = interFace_body
      .split(";")
      .filter(v => v.trim())
  }
};

TarsusStream.prototype.readStruct = function () {
  this._data.forEach((el) => {
    this._read_struct_(el);
  });
  console.log(TarsusStream.struct_map);
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

/**
 * 删除注释
 * @param {string} str 需要删除注释的字符串
 * @returns {string} 删除注释后的字符串
 * @deprecated 弃用
 */
TarsusStream.removeComment = function (str) {
  return str.replace(/\/\/\s*([\u4e00-\u9fa5\w]+)\s*/g, "");
};

TarsusStream.parse = function (body) {
  let { req, data } = body;
  let struct = TarsusStream.struct_map.get(req);
  let _data = {};

  if (struct === undefined) {
    return {}
  }
  
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
      if (typeof check_type != "function") {
        _data[item.param] = check_type;
      } else {
        check_type(data[item.param])
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
        if (typeof value == "number" || !isNaN(value)) return value;
        return TaroError.int;
      }
      case "string": {
        if (typeof value == "string") return value;
        return TaroError.string;
      }
      case "bool": {
        if (typeof value == "boolean") return value;
        return TaroError.bool;
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
        if (!data) data = [];

        if (T == "Set") {
          data = Array.from(new Set(data));
        }
        let is_type_available;
        if (TarsusStream.base_struct.indexOf(req) > -1) {
          is_type_available = data.every((item) =>
            typeof TarsusStream.check_type(item, req)  != "function"
          );
          if (is_type_available) return data;
          is_object_type(item)
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


TarsusStream.define_struct = function (clazz) {
  // 设置 自定义struct
  if (clazz instanceof Array) {
    clazz.forEach(item => {
      TarsusStream.define_struct(item)
    })
  } else {
    TarsusStream.define_structs[clazz.name] = clazz;
  }
}

TarsusStream.get_struct = function (clazzName) {
  return TarsusStream.define_structs[clazzName]
}

module.exports = {
  TarsusStream,
};
