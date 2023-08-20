const path = require("path");
const process = require("process");
const fs = require("fs");

const {TarsusStream} = require("../../src/stream/index");

var TaroCreateObject = function (type, taro_file_path, option) {
    switch (type) {
        case "ts": {
            let StructToFile = "";
            // 添加依赖
            StructToFile += `const { TarsusReadStream } = require("tarsus-cli/taro");\n`;

            // 每一个 类型进行设置
            TarsusStream.struct_map.forEach((value, key) => {
                StructToFile += `export class ${key}{ \n`;
                // 先 确定成员变量给
                value.forEach((item) => {
                    let ts_type = item.type.replace("int", "number").replace("List<", "Array<");

                    // item.type = item.type.replace("int", "number");
                    // if (item.type.startsWith("List")) {
                    //   item.type = item.type.replace("List", "Array");
                    // }
                    StructToFile += " public " + item.param + " : " + ts_type + ";\n";

                });
                StructToFile += `constructor(...args:any[]){ \n`
                StructToFile += ` const _TarsusReadStream = new TarsusReadStream("${key}", args);\n`


                value.forEach((item) => {
                    let isBase = TarsusStream.base_struct.some(ele => item.type == ele)
                    // 是否为基础类型
                    if (isBase) {
                        if (item.type == "int") {
                            StructToFile += `this.${item.param} = _TarsusReadStream.read_int(${item.index});\n `
                        }
                        if (item.type == "string") {
                            StructToFile += `this.${item.param} = _TarsusReadStream.read_string(${item.index});\n`
                        }
                    } else if (item.type.startsWith("List")) {
                        StructToFile += `this.${item.param} = _TarsusReadStream.read_list(${item.index},"${item.type}");\n`
                    } else { // Set List
                        StructToFile += `this.${item.param} = _TarsusReadStream.read_struct(${item.index},"${item.type}");`
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


TaroCreateObject.TS = function () {
}
TaroCreateObject.TS.TsBase_Obj = ["number", "string"]
TaroCreateObject.TS.TsObj = ["Array", "Set"]


TaroCreateObject.GetFilePath = function (fileName) {
    let cwd = process.cwd();
    let filePath = path.resolve(cwd, fileName);
    return filePath;
};


TaroCreateObject.Java = function () {
}

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
import com.tarsus.example.base.inf.TarsusJson;
import com.tarsus.example.base.TarsusStream;
import com.alibaba.fastjson.JSON;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import com.alibaba.fastjson.JSONObject;

${IMPORTS}

@TaroStruct
public class ${key} implements TarsusJson{
  ${PARAMS}

  // ListConstructor
  public ${key}(List<?> list){
    TarsusStream _tarsusStream = new TarsusStream(list, "${key}");
    ${CONSTS}  
  }

  // NoArgsConstructor
  public ${key}(){

  }
  // toJson
  @Override
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
            // 不是复杂类型
            is_obj = BaseStruct.every(el => el != item.type);
            if (is_obj) {
                // 添加引入
                TaroTObj[item.param].import = TaroCreateObject.Java.IMPORT(PKG, item.type)
            }
        }

        // 先做复杂类型
        let JavaType = item.type.replace("string", "String").replace("int", "Integer")
        TaroTObj[item.param].param = `public ${JavaType} ${item.param};\n`;

        // 判断类型，添加构造函数列表
        if (Obj == "List") {
            TaroTObj[item.param].construct = `    this.${item.param} = _tarsusStream.read_list(${item.index},"${item.type}");\n`
        }
        if (is_obj) {
            TaroTObj[item.param].construct = `    this.${item.param} = _tarsusStream.read_struct(${item.index},"${item.type}");\n`
        } else {
            if (item.type == "int") {
                TaroTObj[item.param].construct = `    this.${item.param} = _tarsusStream.read_int(${item.index});\n`
            } else if (item.type == "string") {
                TaroTObj[item.param].construct = `    this.${item.param} = _tarsusStream.read_string(${item.index});\n`
            }
        }
    })

    TaroCreateObject.Java.TaroTObj = TaroTObj


}

module.exports = {
    TaroCreateObject,
};
