module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
   //添加支持按需引入配置
   plugins: [
    //添加支持按需引入配置
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
}
