module.exports = {
    web: {
        // 用于定义webpack的输出路径
        publicPath: '/center/',
    
        // 自定义端口号
        port: 3997,
    
        // 打包的定义
        appName: "Tarsus",
        serverName: "Center",
        proxy: {
            '/api': {
                target: 'http://localhost:3411/api', // 你要请求的目标接口地址
                changeOrigin: true, // 改变请求的源
                pathRewrite: {
                    '^/api': '', // 将URL中的/api路径替换为空字符串
                },
                headers: {
                    'Access-Control-Allow-Origin': '*', // 添加此行
                },
            }
        },
        clientChain:function(chain) {
            chain.output.filename("bundle.js").end()
        },
        serverChain:function(chain) {
            
        }
    }
}