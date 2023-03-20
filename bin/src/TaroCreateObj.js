const path = require("path");
const process = require("process");
const fs = require("fs")

const { TarsusStream } = require("../../src/stream/index");

function TaroCreateObject(type, taro_file_path) {
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

          StructToFile += "  "+item.param + " : " + item.type + ";\n";
        });
        StructToFile += "};\n\n";
      });
      let toWriteFilePath = taro_file_path.replace(".taro", ".ts");
      fs.writeFileSync(toWriteFilePath, StructToFile);
      break;
    }

    case "java": {
      let StructToFile = "";
      TarsusStream.struct_map.forEach((value, key) => {
        StructToFile += `public class ${key}{`;

        value.forEach((item) => {
          item.type = item.type.replace("int", "Integer");

          StructToFile += "public " + item.type + " " + item.param + ";\n";
        });
        StructToFile += "}";

        fs.writeFileSync(GetFilePath(key + ".java"), StructToFile);
        StructToFile = "";
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
