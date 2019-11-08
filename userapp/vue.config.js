let path = require('path');
function resolve(dir) {
    console.log(dir);
    return path.join(__dirname, '.', dir)
}
const isProduction = process.env.NODE_ENV === 'production';
const cdn = {
    css: [],
    js: [
        "https://cdn.bootcss.com/vue/2.6.10/vue.min.js",
        "https://cdn.bootcss.com/vue-router/3.0.7/vue-router.min.js",
        "https://cdn.bootcss.com/axios/0.19.0/axios.min.js",
        "https://cdn.bootcss.com/element-ui/2.11.1/index.js",
        "https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js"
    ]
}
module.exports = {
    publicPath: '/',
    outputDir: './dist',
    indexPath: 'index.html',
    runtimeCompiler: false,

    // 打包 不再使用sourcemap
    productionSourceMap: false,
    lintOnSave:false,
    chainWebpack: config => {
        config.entry('main').add('babel-polyfill');
        config.resolve.alias.set('_c', path.resolve(__dirname, 'src/components'));
        config.resolve.alias.set('_v', path.resolve(__dirname, 'src/views'));
        config.resolve.alias.set('img', path.resolve(__dirname, 'static/images'));
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
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
        // 生产环境配置
        if (isProduction) {
            // 压缩代码
            config.optimization.minimize(true);
            // 分割代码
            config.optimization.splitChunks({
                chunks: 'all'
            })
            // 生产环境注入cdn
            config.plugin('html')
                .tap(args => {
                    args[0].cdn = cdn;
                    return args;
                });
        }   
    },
    devServer: { // 开发 服务时使用
        disableHostCheck: true,
        port: 8082,
    },
    configureWebpack: config => {
        // 生产环境配置
        if (isProduction) {
            config.externals = {
                'vue':'Vue',
                'vuex':'Vuex',
                'vue-router':'VueRouter',
                'axios':'axios',
                'element-ui': 'ELEMENT',
            }
        };
    }
}




