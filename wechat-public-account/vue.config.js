let path = require('path');
module.exports = {
    publicPath: '/',
    // 打包 不再使用sourcemap
    productionSourceMap: false,
    lintOnSave:false,
    chainWebpack: config => {
        config.entry('main').add('babel-polyfill');
        config.resolve.alias.set('_c', path.resolve(__dirname, 'src/components'));
        config.resolve.alias.set('_v', path.resolve(__dirname, 'src/views'));
        config.resolve.alias.set('img', path.resolve(__dirname, 'static/images'));
    },
    devServer: {
        disableHostCheck: true,
        port: 8084,
    },
    configureWebpack:{
     
    }
  
    
}


