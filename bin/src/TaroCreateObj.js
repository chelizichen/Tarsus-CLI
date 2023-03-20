const path = require("path");
const process = require("process");
const fs = require("fs")

const { TarsusStream } = require("../../src/stream/index");

function TaroCreateObject(type, taro_file_path, option) {
  switch (type) {
    case "ts": {
      let StructToFile = "";
      // 每一个 类型进行设置
      TarsusStream.struct_map.forEach((value, key) => {
        StructToFile += `type ${key} = { \n`;

        value.forEach((item) => {
          item.type = item.type.replace("int", "number");
          if (item.type.startsWith("List")) {
            item.type = item.type.replace("List", "Array");
          }

          StructToFile += "  " + item.param + " : " + item.type + ";\n";
        });
        StructToFile += "};\n\n";
      });
      let toWriteFilePath = taro_file_path.replace(".taro", ".ts");
      fs.writeFileSync(toWriteFilePath, StructToFile);
      break;
    }

    case "java": {
      let package = option.package;

      TarsusStream.struct_map.forEach((value, key) => {
        let StructToFile = "";
        let getT = new RegExp(/<(.*)>/)
        // 1 判断是否有 List Set 等
        let JavaObj = Array.from(new Set(value.map(item => {
          if (item.type.startsWith("List")) {

            let typeStruct = "";
            let data = getT.exec(item.type)[1]
            
            // 如果没有基本类型
            if (!TarsusStream.base_struct.some(base => data == base)) {
              // 引入新的类型
              typeStruct += "import " + package + "." + data + ";\n";
            }

            typeStruct += "import java.util.List;\n"
            return typeStruct
          }

          if (item.type.startsWith("Set")) {
            let typeStruct = "";
            let data = getT.exec(item.type)[1]
            
            // 如果没有基本类型
            if (!TarsusStream.base_struct.every(base => data == base)) {
              // 引入新的类型
              typeStruct += "import " + package + "." + data + ";\n";
            }
            
            typeStruct += "import java.util.Set;\n"
            return typeStruct
          }

        }).filter(v => v)))

        StructToFile += "package " + option.package + ";\n"

        JavaObj.forEach(item => {
          StructToFile += item
        })

        StructToFile += `public class ${key}{ \n`;

        value.forEach((item) => {
          item.type = item.type.replace("int", "Integer"); // String类型为 Integer
          item.type = item.type.replace("string", "String") // 替换类型为 String
          StructToFile += "     public " + item.type + " " + item.param + ";\n";
        });

        StructToFile += "}";

        fs.writeFileSync(GetFilePath(key + ".java"), StructToFile);
      });
      break;
    }
  }
}

function GetFilePath(fileName) {
  let cwd = process.cwd();
  let filePath = path.resolve(cwd, fileName);
  return filePath;
}

module.exports = {
  TaroCreateObject,
};
