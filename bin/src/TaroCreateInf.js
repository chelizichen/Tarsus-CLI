const { writeFileSync } = require("fs");
const { TarsusStream } = require("../../src/stream/index");


var TaroCreateInf = function (type, taro_file_path, option) {
  const tarsusstream    = new TarsusStream(taro_file_path);
  const interFace       = tarsusstream._interFace;
  const interFace_Name  = tarsusstream._interFace_name;
  const data            = TaroCreateInf.createInf(interFace);
  const context         = {taro_file_path,option,interFace_Name,tarsusstream,data,interFace}
  if(type == "go"){
    TaroCreateInf.compile2GoInterface(context)
  }
  if (type == "java") {
    TaroCreateInf.compile2JavaInterface(context)
  }
  if(type == "ts"){
    TaroCreateInf.compile2TypeScriptInterface(context)
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
    javaCode += `public ${interfaceObj.responseType} ${interfaceObj.methodName}(${interfaceObj.requestType} req, ${interfaceObj.responseType} res);\n`;
  }

  // Generate Node.js code
  let nodejsCode = "";
  for (let i = 0; i < interfaces.length; i++) {
    let interfaceObj = interfaces[i];
    nodejsCode += `${interfaceObj.methodName}(Request:${interfaceObj.requestType},Response:${interfaceObj.responseType}):Promise<${interfaceObj.responseType}> \n    `
    // nodejsCode += `app.${interfaceObj.returnType.toLowerCase()}('${
    //   interfaceObj.methodName
    // }', function(req, res) {\n\t// Implementation\n});\n`;
  }
  return { javaCode: javaCode, nodejsCode: nodejsCode };
};

TaroCreateInf.compile2GoInterface = function(context) {
  const{interFace_Name,interFace} = context
  let goCode = `package ${interFace_Name}\n\n`;

  goCode += `type ${interFace_Name} interface {\n`;
  for (const method of interFace) {
      const matches           = method.match(/(\w+) \(Request : (\w+), Response : (\w+)\)/);
      if (matches) {
          const methodName    = matches[1];
          const requestType   = matches[2];
          const responseType  = matches[3];
          goCode              += `    ${methodName}(req ${requestType}, res *${responseType}) (int, error)\n`;
      }
  }
  goCode                      += '}\n';

  writeFileSync(`${interFace_Name}.go`, goCode);
}
TaroCreateInf.compile2JavaInterface = function(context) {
  const {
    taro_file_path,
    option,
    interFace_Name,
    tarsusstream,
    data
  }             = context
  const newF    = taro_file_path.replace(
    option.file,
    interFace_Name.trim() + ".java"
  );
  console.log(newF);
  const render  = ` 
        package ${tarsusstream.JavaConfig.inf};
        import ${tarsusstream.JavaConfig.struct};

        public interface ${interFace_Name}{
          ${data.javaCode}
        }
`;
  writeFileSync(newF, render, "utf-8");
}
TaroCreateInf.compile2TypeScriptInterface = function(context){
  const {
    taro_file_path,
    option,
    interFace_Name,
    data
  }             = context
  const newF    = taro_file_path.replace(
    option.file,
    interFace_Name.trim() + ".ts"
  );
  console.log(newF);
  const render  = `
        interface ${interFace_Name}{
          ${data.nodejsCode}
        }
`;
  writeFileSync(newF, render, "utf-8");
}

module.exports = {
  TaroCreateInf,
};
