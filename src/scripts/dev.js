const path = require('path')
const webpackDevMiddleware = require('webpack-dev-middleware');
const { merge } = require('webpack-merge') // 获取merge函数
const Config = require('webpack-chain')
const webpack = require('webpack');
const express = require('express')
const { cwd } = require("process")
function resolve(...args) {
    return path.resolve(cwd(), ...args)
}

const commonConfig = require("../../config/config")
const { getDevServerOptions } = require("../../lib/dev")

// 专门处理Web的目录
const tarsusConfig = require(resolve("tarsus.config.js")).web;

function loadWebpackDev(app) {
    let isNext = undefined;
    isNext = checkVersion()
    
    if (isNext !== true) {
        throw new  Error(isNext)
    }

    const clientConfig = new Config();
    const baseConfig = commonConfig("development"); // 基础配置
    const devConfig = getDevServerOptions(tarsusConfig)
    try {
        tarsusConfig.clientChain(clientConfig);// 链式调用
    } catch (error) {
        throw new Error(`chain call error:${error}`);
    }
    const afterMergeConfig = merge(baseConfig, clientConfig.toConfig(), devConfig)
    const compiler = webpack(afterMergeConfig);

    const publicPath = afterMergeConfig.output.publicPath


    app.use(publicPath, express.static(resolve('public', 'assets')))

    app.use(
        webpackDevMiddleware(compiler, {
            publicPath, // 公共路径，与 webpack 配置中的 publicPath 保持一致
        })
    );
}

// 检查vue 与对应插件是否一致
function checkVersion() {
    const currentProjectPkg = require(resolve('package.json'))
    const cliPkg = require('../../package.json')

    const projectVueVersion = currentProjectPkg.dependencies.vue
    const cliSfcVersion = cliPkg.dependencies['@vue/compiler-sfc']
    if (projectVueVersion == cliSfcVersion) {
        return true
    }
    // 抛出错误
    return (`VersionError :: vue.version(${projectVueVersion}) != cli.@vue/compiler-sfc.version(${cliSfcVersion})`)


}

module.exports = {
    loadWebpackDev
}