const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      proxy: {
        "/radx-blockchain-ops-user": {
          ws: true,
          changeOrigin: true,
          target: 'http://localhost:7000'
        }
      }
    }
  }
})
