const { writeFileSync } = require("fs");
const { TarsusStream } = require("../../src");

var TaroCreateInf = function (type, taro_file_path, option) {
  let tarsusstream = new TarsusStream(taro_file_path);
  let interFace = tarsusstream._interFace;
  let interFace_Name = tarsusstream._interFace_name;

  let data = TaroCreateInf.createInf(interFace);
  // console.log(interFace_Name);
  if (type == "java") {
    let newF = taro_file_path.replace(
      option.file,
      interFace_Name.trim() + ".java"
    );
    console.log(newF);
    let render = ` package ${option.package};
  public interface ${interFace_Name}{
    ${data.javaCode}
  }`;
    writeFileSync(newF, render, "utf-8");
  }
  if(type == "ts"){
    let newF = taro_file_path.replace(
      option.file,
      interFace_Name.trim() + ".ts"
    );
    console.log(newF);
    let render = `
interface ${interFace_Name}{
    ${data.nodejsCode}
  }`;
    writeFileSync(newF, render, "utf-8");
  }
};

TaroCreateInf.createInf = function (arr) {
  let interfaces = [];

  for (let i = 0; i < arr.length; i++) {
    let str = arr[i];
    let parts = str.split(":");
    let returnType = parts[0].trim().split(" ")[0];
    let methodName = parts[0].trim().split("(")[0].split(" ")[1].trim();
    let reqType = parts[1].trim().split(",")[0].trim();
    let resType = parts[2].trim().split(")")[0].trim();

    let interfaceObj = {
      returnType: returnType,
      methodName: methodName,
      requestType: reqType,
      responseType: resType,
    };
    // console.log(interfaceObj);
    interfaces.push(interfaceObj);
  }

  // Generate Java code
  let javaCode = "";
  for (let i = 0; i < interfaces.length; i++) {
    let interfaceObj = interfaces[i];
    // javaCode += `public ${interfaceObj.returnType} ${interfaceObj.methodName}(${interfaceObj.requestType} req, ${interfaceObj.responseType} res) {\n\t// Implementation\n}\n`;
    javaCode += `public ${interfaceObj.returnType} ${interfaceObj.methodName}(${interfaceObj.requestType} req, ${interfaceObj.responseType} res);\n`;
  }

  // Generate Node.js code
  let nodejsCode = "";
  for (let i = 0; i < interfaces.length; i++) {
    let interfaceObj = interfaces[i];
    nodejsCode += `${interfaceObj.methodName}(Request:${interfaceObj.requestType},Response:${interfaceObj.responseType}):number \n    `
    // nodejsCode += `app.${interfaceObj.returnType.toLowerCase()}('${
    //   interfaceObj.methodName
    // }', function(req, res) {\n\t// Implementation\n});\n`;
  }
  return { javaCode: javaCode, nodejsCode: nodejsCode };
};

module.exports = {
  TaroCreateInf,
};
