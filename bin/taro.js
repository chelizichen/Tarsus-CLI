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

program
  .version("1.0.0")
  .command("link <args>")
  .description("-- compile *.taro")
  .action(function (args) {
    let cwd = process.cwd()
    let taro_file_path = path.resolve(cwd,args)
    new TarsusStream(taro_file_path)
    console.log(TarsusStream.struct_map);
  });


  program.parse(process.argv);