#!/usr/bin/env node
/**
 * *********************************************
 * @link Tarsus-CLI https://github.com/chelizichen/Tarsus-CLI
 * @author chelizichen<1347290221@qq.com>
 * @extends TarsusFarameWork https://github.com/chelizichen/TarsusFrameWork
 * @version 1.0.0
 * @description {
 * 从 *.taro 文件中直接解析对应的结构体
 * 在参数通过Http请求传送给微服务网关时
 * 对数据进行验证，如有错误直接返回
 * 对缺少的参数进行默认参数设置
 * }
 * **********************************************
*/




const program = require("commander")
const fs = require('fs');
const path  = require("path");
const { TarsusStream } = require("../src");

// 解析 Taro 文件
program
  .version("1.0.0")
  .command("link <args>")
  .description("-- compile *.taro")
  .action(function (args) {
    let cwd = process.cwd()
    let taro_file_path = path.resolve(cwd,args)
    new TarsusStream(taro_file_path)
  });

  program
  .version("1.0.0")
  .command("to <type> <file>")
  .description("-- compile *.taro")
  .action(function (type,file) {
    let cwd = process.cwd()
    let taro_file_path = path.resolve(cwd,file)
    new TarsusStream(taro_file_path)
    if(type == "ts"){
      let StructToFile = ""
      // 每一个 类型进行设置
      TarsusStream.struct_map.forEach((value,key)=>{
        StructToFile += `type ${key}= {`
  
        value.forEach(item=>{
          item.type = item.type.replace("int","number")
          if(item.type.startsWith("List")){
            item.type = item.type.replace("List","Array")
          }
  
          StructToFile += item.param + ":" + item.type + ";"
        })
        StructToFile += "};"
      })
      let toWriteFilePath = taro_file_path.replace("taro","ts")
      fs.writeFileSync(toWriteFilePath,StructToFile)
    }
  });

  


  program.parse(process.argv);