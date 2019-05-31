let path = require('path');
module.exports = {
    publicPath:process.env.NODE_ENV === 'production'? '/':'/',
    assetsDir:'asserts',
    outputDir:'./dist',
    runtimeCompiler:false,
    // 打包 不再使用sourcemap
    productionSourceMap:false,
    chainWebpack:config=>{
        config.resolve.alias.set('_c',path.resolve(__dirname,'src/components'));
        config.resolve.alias.set('_v',path.resolve(__dirname,'src/views'));
    },
    configureWebpack:{ // webpack-merge
        plugins:[],
        module:{}
    },
    devServer:{ // 开发 服务时使用
        port:8082,
        proxy:{
            '/api':{
                target:'http://192.168.199.154:8002',
                changeOrigin: true,
                pathRewrite:{
                    '/api':''
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


