const { TarsusStream } = require("./index");



var TarsusReadStream = function (struct, data) {
  // 为拿到的List数据
  this.os_data = data;

  // 为请求体的结构体数据
  this._struct = struct;

  // 拿到对应的结构体数据
  this._struct_obj = TarsusStream.struct_map.get(struct);

  // 拿到所有的keys
  this._struct_keys = TarsusStream.struct_map.keys();
};

TarsusReadStream.prototype.read_int = function (index) {
  index = index - 1;
  let check_type = typeof this.os_data[index] == "number" || !isNaN(this.os_data[index])
  if (!check_type) {
    return 0
  }

  // set default _int value
  let _int = 0;

  // set val
  let _index_data = this.os_data[index] || _int;

  // return
  return _index_data;
};

TarsusReadStream.prototype.read_string = function (index) {
  index = index - 1;

  let check_type = typeof this.os_data[index] == "string"

  if (!check_type) {
    return ""
  }
  // set defalt _str value
  let _str = "";

  // set val
  let _index_data = this.os_data[index] || _str;

  // return
  return _index_data;
};

TarsusReadStream.prototype.read_list = function (index, struct) {
  index = index - 1;

  let check_type = this.os_data[index] instanceof Array

  if (!check_type) {
    return []
  }
  // 得到 Type
  let T_Reg = /<(.*)>/;
  let T = T_Reg.exec(struct)[1];

  // 是否为基础类型 // 后续更改
  if (T == "string" || T == "int" || T == "bool") {
    // 已经Parse成数组了
    let _index_data = this.os_data[index];
    return _index_data
  }
  // 为 特殊复杂类型
  else {
    let T_to_Class = TarsusStream.define_structs[T]
    let _index_data = this.os_data[index].map(item => {
      return new T_to_Class(T, item)
    })
    return _index_data
  }

};

TarsusReadStream.prototype.read_struct = function (index, struct) {
  index = index - 1;

  let check_type = typeof this.os_data[index] == "object"
  if (!check_type) {
    return {}
  }
  let struct_to_class = TarsusStream.define_structs[struct]
  let _map = {};
  let _index_data = new struct_to_class(...this.os_data[index]);
  // let _index_data = new TarsusReadStream(struct, this.os_data[index]);
  return _index_data || _map;
};


module.exports = { TarsusReadStream }
// Demo
// Link 之后再创建一个默认导出的
// 比如 comm.taro 会自动生成一个名为 comm.js




// TarsusStream('./comm.taro')



// class GetUserByIdRes {
//   code;
//   message;
//   data;
//   constructor(...args) {
//     const _TarsusReadStream = new TarsusReadStream("GetUserByIdRes", args)
//     this.code = _TarsusReadStream.read_int(1);
//     this.message = _TarsusReadStream.read_string(2);
//     this.data = _TarsusReadStream.read_struct(3, "User")
//   }
// };

// class User {
//   id;
//   name;
//   age;
//   fullName;
//   address;
//   constructor(...args) {
//     const _TarsusReadStream = new TarsusReadStream("User", args)
//     this.id = _TarsusReadStream.read_string(1);
//     this.name = _TarsusReadStream.read_string(2);
//     this.age = _TarsusReadStream.read_string(3);
//     this.fullName = _TarsusReadStream.read_string(4);
//     this.address = _TarsusReadStream.read_string(5);
//   }
// };

// class GetUserListReq {
//   basic
//   ids
//   constructor(...args) {
//     const _TarsusReadStream = new TarsusReadStream("GetUserListReq", args);
//     this.basic = _TarsusReadStream.read_struct(1, "Basic");
//     this.ids = _TarsusReadStream.read_list(2, "List<int>");
//   }
// }

// class Basic {
//   token;
//   constructor(...args) {
//     const _TarsusReadStream = new TarsusReadStream("Basic", args);
//     this.token = _TarsusReadStream.read_string(1);
//   }
// }

// TarsusStream.define_struct(GetUserByIdRes)
// TarsusStream.define_struct(User)
// TarsusStream.define_struct(GetUserListReq)
// TarsusStream.define_struct(Basic)


// function getArgs(obj) {
//   let arr = Object.values(obj).map((el) => {
//     if (typeof el == "object" && el != null) {
//       return getArgs(el);
//     } else {
//       return el;
//     }
//   });
//   return arr;
// }

// const obj = {
//   code: "0",
//   message: "ok",
//   data: {
//     id: "1",
//     name: "name",
//     age: "11",
//     fullName: "fullName",
//     address: "address"
//   }
// }
// const GetUserListReqData = [
//   [ '12312312asdas' ],
//   [
//     1, 2, 3, 4,  5,
//     6, 7, 8, 9, '测试'
//   ]
// ]

// const data = getArgs(obj)
// const data1 = getArgs(GetUserListReqData)
// const GetUserByIdReqData1 = new GetUserListReq(...data1)
// console.log(GetUserByIdReqData1);
// const getUserByIdRes = new GetUserByIdRes(...data)
// console.log(getUserByIdRes);



