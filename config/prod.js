// webpack.prod.js

const path = require('path');
const {cwd} = require('process');

function resolve(...args) {
    return path.resolve(cwd(), ...args)
}

module.exports = {
    mode: "production",
    stats: {
        errorDetails: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                // exclude: [
                //     /node_modules/,
                //     resolve("src/router"),
                //     resolve("src/app.ts"),
                // ],
                // include: [
                //     resolve("src/client")
                // ],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                ['@babel/preset-typescript', {
                                    // 这个配置是为了处理.vue文件解析后的ts文件
                                    allExtensions: true
                                }]
                            ]
                        }
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],  // 处理在vue文件中使用ts
                            transpileOnly: true,  // 关闭类型检测，这样可以减少编译时间。
                            configFile: resolve("tsconfig.json")
                        }
                    }
                ]
            }
        ]
    }
}

