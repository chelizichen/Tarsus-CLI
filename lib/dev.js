// 修改开发运行时配置
// 最终被merge
// created by chelizichen 
// 2023.7.4
function getDevServerOptions(opt) {
    const { port, publicPath,proxy } = opt;
    return {
        output: {
            publicPath
        },
        devServer: {
            port,
            static: {
                publicPath,
            },
            proxy
        }
    }

}


module.exports = {
    getDevServerOptions
}