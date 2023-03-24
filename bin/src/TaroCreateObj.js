const path = require("path");
const process = require("process");
const fs = require("fs");

const { TarsusStream } = require("../../src/stream/index");

var TaroCreateObject = function (type, taro_file_path, option) {
  switch (type) {
    case "ts": {
      let StructToFile = "";
      // 每一个 类型进行设置
      TarsusStream.struct_map.forEach((value, key) => {
        StructToFile += `export class ${key}{ \n`;
        // 先 确定成员变量给
        value.forEach((item) => {
          item.type = item.type.replace("int", "number");
          if (item.type.startsWith("List")) {
            item.type = item.type.replace("List", "Array");
          }

          StructToFile += " public " + item.param + " : " + item.type + ";\n";

        });
        StructToFile += `constructor(...args:any[]){ \n`
        value.forEach((item)=>{
          let isBase = TaroCreateObject.TS.TsBase_Obj.some(ele=>item.type == ele)
          if(isBase){
            StructToFile += `this.${item.param} = args[${item.index}];\n `
          }else if(Array.from(TarsusStream.struct_map.keys()).indexOf(item.type)>-1){
            StructToFile += `this.${item.param} = new ${item.type}(...args[${item.index}]) \n`
          }else{ // Set List
            let DefineObj_Reg = /<(.*)>/
            let T = DefineObj_Reg.exec(item.type)
            if(T && T.length){
              if( T[1] != "number" && T[1] != "string" && item.type.startsWith("Array") ){
                StructToFile += `this.${item.param} = JSON.parse(args[${item.index}]).map(item=>new ${T[1]}(...Object.values(item))); \n`
              }else if(item.type.startsWith("Array")){
                StructToFile += `this.${item.param} = JSON.parse(args[${item.index}]);\n`
              }
            }
          }
        })
        StructToFile += `}\n`

        StructToFile += "};\n";
      });
      let toWriteFilePath = taro_file_path.replace(".taro", ".ts");
      fs.writeFileSync(toWriteFilePath, StructToFile);
      break;
    }

    case "java": {
      let package = option.package;

      TarsusStream.struct_map.forEach((value, key) => {
        let render = TaroCreateObject.Java.render(key, value, package);

        let getPath = TaroCreateObject.GetFilePath(key + ".java");

        fs.writeFileSync(getPath, render);
      });
      break;
    }
  }
};


TaroCreateObject.TS = function(){}
TaroCreateObject.TS.TsBase_Obj = ["number","string"]
TaroCreateObject.TS.TsObj = ["Array","Set"]


TaroCreateObject.GetFilePath = function (fileName) {
  let cwd = process.cwd();
  let filePath = path.resolve(cwd, fileName);
  return filePath;
};


TaroCreateObject.Java = function () { }

TaroCreateObject.Java.IMPORT_SET = 'import java.util.Set;\n'
TaroCreateObject.Java.IMPORT_LIST = 'import java.util.List;\n'
TaroCreateObject.Java.IMPORT_JSON = 'import com.alibaba.fastjson.JSON;\n'
TaroCreateObject.Java.IMPORT_HASHMAP = "import java.util.HashMap;\n"
TaroCreateObject.Java.IMPORT_ARRAY_LIST = "import java.util.ArrayList;\n"

/**
 * @param {string} package 
 * @param {string} CLASS 
 * @returns {string}
 */
TaroCreateObject.Java.IMPORT = function (package, CLASS) {
  return ` import ${package}.${CLASS};\n`;
}

/**
 * @param {Array} targetArray 
 */
TaroCreateObject.FilterTheSame = function (targetArray) {
  return Array.from(new Set(targetArray))
}



TaroCreateObject.Java.render = function (key, value, package) {
  TaroCreateObject.Java.PKG = package
  // 设置引入的参数和构造函数
  TaroCreateObject.Java.SetImport(value)

  let IMPORTS = ""
  let PARAMS = ""
  let CONSTS = ""
  // console.log(TaroCreateObject.Java.TarTObj);
  for (let k in TaroCreateObject.Java.TaroTObj) {
    let obj = TaroCreateObject.Java.TaroTObj[k]
    if (obj.import) {
      IMPORTS += obj.import
    }
    PARAMS += obj.param
    CONSTS += obj.construct
  }

  let render = `
package ${package};
import com.tarsus.example.decorator.TaroStruct;
${TaroCreateObject.Java.IMPORT_LIST}
${TaroCreateObject.Java.IMPORT_JSON}
${TaroCreateObject.Java.IMPORT_ARRAY_LIST}
${TaroCreateObject.Java.IMPORT_HASHMAP}
import com.alibaba.fastjson.JSONObject;
${IMPORTS}

@TaroStruct
public class ${key}{
  ${PARAMS}

  // ListConstructor
  public ${key}(List<Object> list){
    ${CONSTS}  
  }

  // NoArgsConstructor
  public ${key}(){

  }
  // toJson
  public String json(){
    Object o = JSONObject.toJSON(this);
    return o.toString();
  }
}
  `
  return render
};

// 这一步需要匹配 复杂类型
// for exmaple
// List<User> 在解析的时候我们需要匹配为 User
// 自动生成 import xxx.User
// 和 在 构造函数时自动生成
// this.xxx = JSON.parseArray(list.get(index),User.class);
// User 在解析的时候需要

TaroCreateObject.Java.SetImport = function (value) {

  let getT = new RegExp(/<(.*)>/);
  let BaseStruct = TarsusStream.base_struct
  let PKG = TaroCreateObject.Java.PKG
  let TaroTObj = {}

  value.forEach(item => {
    TaroTObj[item.param] = {}
    TaroTObj[item.param].index = item.index;

    let T = getT.exec(item.type)


    // 将  List<User> repleace 为 List
    let Obj = ""
    let is_obj = false
    // 直接匹配复杂类型
    if (T) {
      is_obj = BaseStruct.every(el => el != T[1]);
      Obj = item.type.replace(T[0], "");
      if (is_obj) {
        // 添加引入 
        TaroTObj[item.param].import = TaroCreateObject.Java.IMPORT(PKG, T[1])
      }
    } else {
      is_obj = BaseStruct.every(el => el != item.type);
      if (is_obj) {
        // 添加引入 
        TaroTObj[item.param].import = TaroCreateObject.Java.IMPORT(PKG, item.type)
      }
    }

    item.type = item.type.replace("string", "String").replace("int", "Integer")

    // 复杂类型 列表
    if (Obj == "List" && T && T[1] != "int") {
      TaroTObj[item.param].construct = `
      List<HashMap> listMaps${item.index-1} = JSON.parseArray((String) list.get(${item.index-1}), HashMap.class);
      this.${item.param} = new ArrayList<>();
      for(HashMap hm : listMaps${item.index-1}){
        ${T[1]} ${T[1].toLowerCase()} = new ${T[1]}();
        ${
          TarsusStream.struct_map.get(T[1]).map(el=>{
            return `${T[1].toLowerCase()}.${el.param} = (String) hm.get("${el.param}");`
          }).join("\n        ")
        }
        this.${item.param}.add(${T[1].toLowerCase()});
      }
      `
    } else if (Obj == "List") {
      // 普通类型列表  
      let commType = item.type.replace("List<","").replace(">","")
      TaroTObj[item.param].construct = `this.${item.param} = JSON.parseArray((String) list.get(${item.index - 1}),${commType}.class);\n  `
    } else if (is_obj) {

      TaroTObj[item.param].construct = `this.${item.param} = new ${item.type}((List<Object>)list.get(${item.index - 1}));\n  `;
    } else {

      if (item.type == "Integer") {
        TaroTObj[item.param].construct = `this.${item.param} = Integer.valueOf((String) list.get(${item.index - 1}));\n  `;
      } else if(item.type == "String"){
        TaroTObj[item.param].construct = `this.${item.param} = (String) list.get(${item.index - 1});\n  `;
      }
    }
    TaroTObj[item.param].param = `public ${item.type} ${item.param};\n  `

  })

  TaroCreateObject.Java.TaroTObj = TaroTObj


}

module.exports = {
  TaroCreateObject,
};
