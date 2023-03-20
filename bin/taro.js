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
const { TaroCreateObject } = require("./src/TaroCreateObj")

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
    TaroCreateObject(type,taro_file_path)
  });

  


  program.parse(process.argv);