const path = require('path')
const pkg = require('./package.json')
// const StyleLintPlugin = require('stylelint-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function resolve(dir) {
  return path.join(__dirname, dir)
}

const externals = {
  vue: {
    commonjs2: 'vue',
    commonjs: 'vue',
    root: ['BubbtyCore', 'Vue'],
  },
  vuex: {
    commonjs2: 'vuex',
    commonjs: 'vuex',
    root: ['BubbtyCore', 'Vuex'],
  },
  '@bubbty/core': {
    commonjs2: '@bubbty/core',
    commonjs: '@bubbty/core',
    root: 'BubbtyCore',
  },
  '@bubbty/elements': {
    commonjs2: '@bubbty/elements',
    commonjs: '@bubbty/elements',
    root: 'BubbtyElements',
  },
  '@bubbty/ui': {
    commonjs2: '@bubbty/ui',
    commonjs: '@bubbty/ui',
    root: 'BubbtyUi',
  },
  '@bubbty/settings': {
    commonjs2: '@bubbty/settings',
    commonjs: '@bubbty/settings',
    root: 'BubbtySettings',
  },
}

module.exports = {
  productionSourceMap: false,
  publicPath: './',
  devServer: {
    // open:false,      // 是否打开浏览器;
    // hotOnly:true,    // 是否热更新;
    proxy: {
      '/api': {
        // 路径中有 /api 的请求都会走这个代理 , 可以自己定义一个,下面移除即可
        target: 'http://xktwebapi.changyan.com', // 目标代理接口地址,实际跨域要访问的接口,这个地址会替换掉 axios.defaults.baseURL
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        ws: true, // 是否启用  websockets;
        pathRewrite: {
          // 去掉 路径中的  /api  的这一截
          '^/api': '',
        },
      },
      '/auth': {
        // 路径中有 /api 的请求都会走这个代理 , 可以自己定义一个,下面移除即可
        target: 'http://aiplat.changyan.com/auth', // 目标代理接口地址,实际跨域要访问的接口,这个地址会替换掉 axios.defaults.baseURL
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        ws: true, // 是否启用  websockets;
        pathRewrite: {
          // 去掉 路径中的  /api  的这一截
          '^/auth': '',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          $prefix: ${pkg.prefix};
          @import "~@/assets/styles/variable.scss";
        `,
      },
    },
  },
  chainWebpack: (config) => {
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config
        .entry('app')
        .clear()
        .add('./src/index.ts') // 生产环境
        .end()
    })
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.entry('app').clear().add('./src/main.ts') // 开发环境
    })
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options = {}) => Object.assign(options, { limit: 5120 }))
    config.module 
      .rule('scss')
      .use(MiniCssExtractPlugin.loader)
  },
  configureWebpack: {
    externals: process.env.NODE_ENV === 'production' ? externals : {},
    resolve: {
      alias: {},
    },
    plugins: [
      // new StyleLintPlugin({
      //   files: ['src/**/*.{vue,html,css,scss,sass}'],
      //   failOnError: false,
      //   cache: false,
      //   fix: false,
      // }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      })
    ],
    performance: {
      hints: false,
    },
  },
}
