let path = require('path');
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    assetsDir: 'asserts',
    outputDir: './dist',
    runtimeCompiler: false,
    // 打包 不再使用sourcemap
    productionSourceMap: false,
   

    chainWebpack: config => {
        config.resolve.alias.set('_c', path.resolve(__dirname, 'src/components'));
        config.resolve.alias.set('_v', path.resolve(__dirname, 'src/views'));
        config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
        //const svgRule = config.module.rule('svg')
        //svgRule.uses.clear()
        config.module
            .rule('svg-sprite-loader')
            .test(/\.svg$/)
            .include
            .add(resolve('src/icons')) //处理svg目录
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
        // 修改images loader 添加svg处理
        const imagesRule = config.module.rule('images')
        imagesRule.exclude.add(resolve('src/icons'))
        config.module
            .rule('images')
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)

    },
    configureWebpack: { // webpack-merge
        plugins: [],
        module: {}
    },
    devServer: { // 开发 服务时使用
        port: 8082,
        proxy: {
            '/api': {
                target: 'http://192.168.199.99:8100',
                changeOrigin: true,
                pathRewrite: {
                    '/api': ''
                }
            },
            // '/api/hengdong':{
            //     target:'http://192.168.199.103:8100',
            //     changeOrigin: true,
            //     pathRewrite:{
            //         '/api':''
            //     }
            // },
            // '/fuquan':{
            //     target:'http://192.168.199.245:5000',
            //     changeOrigin: true,
            //     pathRewrite:{
            //         '/fuquan':''
            //     }
            // }
        }
    },
    pluginOptions: {

    }
}


