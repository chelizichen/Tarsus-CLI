const path = require('path')
const webpackDevMiddleware = require('webpack-dev-middleware');
const { merge } = require('webpack-merge') // 获取merge函数
const Config = require('webpack-chain')
const webpack = require('webpack');
const express = require('express')

function resolve(...args) {
    return path.resolve(cwd, ...args)
}

const commonConfig = require("../../config/config")
const { getDevServerOptions } = require("../../lib/dev")

// 专门处理Web的目录
const tarsusConfig = require(resolve("tarsus.config.js")).web;

function loadWebpackDev(app){
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


module.exports = {
    loadWebpackDev
}