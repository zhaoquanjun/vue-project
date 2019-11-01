module.exports = {
    "presets": [
      "@vue/app",
      // {
      //   "polyfills": [
      //     'es6.promise',
      //     'es6.symbol'
      //   ]
      // }
      // ['@babel/preset-env',{'modules': 'es2015'}]
    ],
    "plugins": [
      [
        "component",
        {
          "libraryName": "element-ui",
          "styleLibraryName": "theme-chalk"
        }
      ]
    ]
  }
  
