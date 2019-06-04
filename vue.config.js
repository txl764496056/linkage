module.exports = {
    devServer:{
        // 设置端口号
        // port:8089
    },
    // 关闭eslint检测
    lintOnSave:false,
    // 打包路径
    publicPath:"./",
    pwa:{
        iconPaths:{
            favicon32:'favicon.ico',
            favicon16:'favicon.ico'
        }
    }
}