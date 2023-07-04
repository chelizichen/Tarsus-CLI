// webpack.common.js
/**
 * common普通配置，用于配置output和固定的vueApp
 * 
 */
const { merge } = require('webpack-merge') // 获取merge函数
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const { cwd } = require('process');

function resolve(...args) {
    return path.resolve(cwd(),...args)
}

const StyleRules = [
    {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: [resolve('src', 'client')]
    },
    {
        test: /\.css$/, // 匹配css文件
        use: [
            "style-loader",
            {
                loader: "css-loader",
                options: {
                    importLoaders: 1, // css-loader前还有几个loader
                },
            },
            {
                loader: "postcss-loader",
                options: {
                    postcssOptions: {    // 对postcss的配置也可以单独抽离到一个文件中，这里就不抽取了。
                        plugins: ['postcss-preset-env'],
                    }
                },
            },
        ],
        include: [resolve('src', 'client')]
    },
    {
        test: /\.less$/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 2
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: ['postcss-preset-env']
                    }
                }
            },
            'less-loader'
        ],
        include: [resolve('src', 'client')]
    }
]


const commonConfig = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // 编译必须排除core-js中的代码，不然可能会发生错误
                        exclude: [
                            /node_modules[\\\/]core-js/,
                            /node_modules[\\\/]webpack[\\\/]buildin/,
                        ],
                        presets: [['@babel/preset-env', {
                            useBuiltIns: 'usage',
                            corejs: 3
                        }]]
                    }
                }
            },
        ].concat(StyleRules)
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: 'Demo',
            template: resolve('public', 'index.html')
        }),
    ],
    /**
     * Webpack配置中的output选项用于定义输出文件的相关配置。下面列出了output对象中常用的选项：
        filename: 定义输出文件的文件名。可以使用占位符（placeholders）来生成不同的文件名，
        例如 [name] 表示入口文件的名称，[hash] 表示编译过程中生成的哈希值。
    
        path: 定义输出文件的存储路径。可以是绝对路径或相对于配置文件的相对路径。
    
        publicPath: 定义在引用输出文件时的公共路径（public path）。
        可以是绝对路径或相对路径。它在处理静态资源时非常有用，例如图片、字体等文件的引用路径。
    
        chunkFilename: 定义非入口文件（chunk）的文件名。类似于filename选项，可以使用占位符来生成不同的文件名。
    
        library: 定义输出库（library）的名称。可以通过该选项将你的代码打包成一个可复用的库，供其他项目使用。
    
        libraryTarget: 定义输出库的目标环境。可以是 var、umd、commonjs2、commonjs、amd、this、window、global 等选项。
        
        pathinfo: 一个布尔值，用于控制是否在生成的包中包含有关模块路径的注释。
        默认情况下为 false，意味着生成的包将不包含注释。
        这些选项允许你对输出文件进行灵活的配置，以满足你的需求。根据你的项目类型和目标环境，你可以选择适合的选项进行配置。
     */
    output: {
        path: resolve('public', 'assets'),
        filename: 'bundle.js',
        publicPath: '/tgoperate/' // 公共路径 这个是其他文件地址的路径
    },
    entry: {
        vueApp: resolve('src', 'client', 'main.ts')
    },
    resolve: {
        extensions: [".ts", ".js",],
        alias: {
            '@': resolve('src', 'client'),// 这样配置后 @ 可以指向 src 目录
            'vue$':resolve('node_modules','vue','index.js'),
            // 'vue$':'vue/index.js',
        }
    },
}
// 这个对象保存着之前的配置

module.exports = (mode) => {
    // 判断当前的模式
    let config = null;
    // 根据不同模式，导入不同配置
    if (mode === 'production') {
        config = require('./prod')
    } else {
        config = require('./dev')
    }
    // 返回合并后的配置文件
    return merge(commonConfig, config)
}

