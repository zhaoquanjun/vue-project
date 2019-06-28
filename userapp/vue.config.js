let path = require('path');
function resolve(dir) {
    console.log(dir);
    return path.join(__dirname, '.', dir)
}
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir: './dist',
    indexPath: 'index.html',
    runtimeCompiler: false,

    // 打包 不再使用sourcemap
    //productionSourceMap: false,
    chainWebpack: config => {
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
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)

    },
    configureWebpack: { // webpack-merge
        plugins: [],
        module: {}
    },
    devServer: { // 开发 服务时使用
        disableHostCheck: true,
        port: 8082,
    },
    pluginOptions: {

    }
}


