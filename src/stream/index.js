const { readFileSync } = require("fs");

var TarsusStream = function (url) {
  TarsusStream.struct_map = new Map();
  TarsusStream.base_struct = ["int", "string"];
  TarsusStream.object_struct = ["List"];

  this._stream = readFileSync(url, "utf-8").trim().replace(/\n|\r/g, ""); // 拿到并去除换行

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

  this.readStruct();
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
      if (check_type) {
        _data[item.param] = data[item.param];
      } else {
        throw new TypeError(`${data[item.param]} is not typeof ${item.type}`);
      }
    }
  });
  return _data;
};

TarsusStream.check_type = function (value, type) {
  if (value == undefined) {
    return true;
  }

  let is_base_type = TarsusStream.base_struct.indexOf(type) > -1;
  if (is_base_type) {
    switch (type) {
      case "int": {
        if (typeof value == "number") return true;
        return false;
      }
      case "string": {
        if (typeof value == "string") return true;
        return false;
      }
      default: {
        return false;
      }
    }
  }
  return false;
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
  let T = "" // 泛型
  // 是否为复杂类型
  let is_object_type = TarsusStream.base_struct.indexOf(type) == -1;
  if (is_object_type) {
    // 是否为List 之类的
    let is_object_type = TarsusStream.object_struct.some((item) =>{
      return (type.startsWith(item) && !req?req=match_reg.exec(type)[1]:"") && !T?T=item:""
    });
    if (is_object_type) {
      if(T == "List"){
        if(TarsusStream.base_struct.indexOf(req)>-1){
          let is_type_available = data.every(item=>TarsusStream.check_type(item,req))
          if(is_type_available)return data;
          return []
        }else{
          let ret = data.map(el=>{
            let body = {
              req,
              data:el
            }
            return TarsusStream.parse(body)
          })
          return ret
        }
      }
    } else {
      let body = {
        req: type,
        data,
      };
      let _data = TarsusStream.parse(body);
      return _data;
    }
  }
  return null;
};


let stream_test = new TarsusStream("src/stream/test.taro");

let taro = {
  GetGoodReq: {
    req: "GetGoodReq",
    data: {
      id: 1,
      message: "测试",
    },
  },
  GetGoodRes: {
    req: "GetGoodRes",
    data: {
      data: {
        price: 1123,
        id: 1,
        name: "测试商品",
        info:{
          url  :"路径",
          sort :"分类",
          desc :"描述",
        }
      },
      message: "测试",
      code: 1,
    },
  },
};

let queryList = {
  GetGoodsListReq: {
    req: "GetGoodsListReq",
    data: {
      message: "测试",
      ids: [1,2,3,4,5],
    },
  },
  GetGoodsListRes: {
    req: "GetGoodsListRes",
    data: {
      code: 1,
      message:"ok",
      data:[
        {
          price: 1123,
          id: 1,
          name: "测试商品",
          info:{
            url  :"路径",
            sort :"分类",
            desc :"描述",
          }
        },
        {
          price: 1123,
          id: 1,
          name: "测试商品",
          info:{
            url  :"路径",
            sort :"分类",
            desc :"描述",
          }
        },
        {
          price: 1123,
          id: 1,
          name: "测试商品",
          info:{
            url  :"路径",
            sort :"分类",
            desc :"描述",
          }
        }
    ]
    },
  },
};



// const _data1 = TarsusStream.parse(taro.GetGoodReq);
// const _data2 = TarsusStream.parse(taro.GetGoodRes);

// console.log(_data1);
// console.log(_data2);

debugger
// const _data3 = TarsusStream.parse(queryList.GetGoodsListReq);
const _data4 = TarsusStream.parse(queryList.GetGoodsListRes);

// console.log(_data3);
console.log(_data4);
