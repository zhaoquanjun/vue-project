let path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const isProduction = process.env.NODE_ENV === "production";
// const https = require("https");
// const fs = require("fs");
const cdn = {
  css: [],
  js: [
    "https://cdn.bootcss.com/vue/2.6.10/vue.min.js",
    "https://cdn.bootcss.com/vue-router/3.0.7/vue-router.min.js",
    "https://cdn.bootcss.com/axios/0.19.0/axios.min.js",
    "https://cdn.bootcss.com/element-ui/2.11.1/index.js",
    "https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js"
  ]
};

function resolve(dir) {
  return path.join(__dirname, ".", dir);
}

module.exports = {
  publicPath: "/",
  // 打包 不再使用sourcemap
  productionSourceMap: false,
  lintOnSave: false,
  chainWebpack: config => {
    config.entry("main").add("babel-polyfill");
    config.resolve.alias.set("_c", path.resolve(__dirname, "src/components"));
    config.resolve.alias.set("_v", path.resolve(__dirname, "src/views"));
    config.resolve.alias.set("img", path.resolve(__dirname, "static/images"));
    // 生产环境配置
    if (isProduction) {
      // 压缩代码
      config.optimization.minimize(true);
      // 分割代码
      // config.optimization.splitChunks({
      //     chunks: 'all'
      // })
      // 生产环境注入cdn
      config.plugin("html").tap(args => {
        args[0].cdn = cdn;
        return args;
      });
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/theme-chalk/common/var.scss";`
      }
    }
  },

  devServer: {
    disableHostCheck: true,
    port: 8081,
    host: "0.0.0.0"
    // https: {
    //   key: fs.readFileSync(
    //     path.resolve(__dirname, "./static/cert/privatekey.pem")
    //   ),
    //   cert: fs.readFileSync(
    //     path.resolve(__dirname, "./static/cert/certificate.pem")
    //   )
    // }
  },
  configureWebpack: config => {
    // 生产环境配置
    if (isProduction) {
      config.externals = {
        vue: "Vue",
        vuex: "Vuex",
        "vue-router": "VueRouter",
        axios: "axios",
        "element-ui": "ELEMENT"
      };
    }
    config.plugins.push(
      new webpack.ProvidePlugin({
        "window.Quill": "quill/dist/quill.js",
        Quill: "quill/dist/quill.js"
      })
      // new BundleAnalyzerPlugin()
    );
  }
};
