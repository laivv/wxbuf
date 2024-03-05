# <center>wxbuf</center>

轻量级的微信原生小程序状态管理与事件通信的javascript库

为什么叫`wxbuf`？玩过游戏的都知道加`buff`就是增加状态，变强的意思。这就是取名`wxbuf`的原因。    

`wxbuf`对小程序原生API进行了扩展，增加了以下功能
* 支持全局数据（store）管理
* 支持storage数据管理
* 支持更易用的跨组件跨页面通信方式，彻底解决通信问题
* 支持store、storage变化监听
* 更方便的page间数据传递方式
* 支持跨组件层级传递数据
* Page、Component支持computed计算属性
* Page支持observers字段监听器
* 自动反序列化页面url参数中的object、number、null、undefined、array字段，在onLoad钩子中自动接收反序列化后的参数
* 支持全局生命周期监听
* 支持全局路由前置守卫钩子、路由变化钩子，方便路由级权限控制
* 支持全局view标准事件拦截，方便按钮级权限控制
* 全局开启所有页面的分享功能
* Component支持更多pageLifeTimes
* Component支持向所在的page安装方法
* 全局扩展page、component的实例方法
* 支持定义顶级全局变量
* 修复wx官方自定义tabbar组件中的pageLifetimes不工作的问题
* 更多功能请查看文档
---
## 起步
在app.js文件头部引入:
```js
// app.js
import wxbuf from './utils/wxbuf'

App({
  globalData: {},
  onLaunch() {

  }
    //...
})
```
确保`wxbuf`正确引入，然后开始愉快的使用它   

下面是一个比较丰富的例子，其中使用了大量`wxbuf`的特色功能    
```js
// app.js
import wxbuf from './utils/wxbuf'

// wxbuf.config({ /** */}) // 全局配置项
// wxbuf.watch({ /** */}) // 全局监听器
// wxbuf.global.extend({ /** */}) // 定义顶级全局变量
// wxbuf.page.extend({ /** */}) // 全局扩展page实例方法
// wxbuf.component.extend({ /** */}) // 全局扩展component实例方法

App({
  //声明事件监听器
  listeners: {
    loginOk(event) {
      console.log('登录成功')
      console.log(event.detail.token)
    }
  },
  // 全局数据
  globalData: {
    isLogin: false,
    version: 'app-v1.0'
  },
  // 监听storage变化
  onStorageChange(kvs, oldKvs) {
    if(Object.keys(kvs).includes('token')) {
      this.setStore('isLogin', kvs.token ? true : false)
    }
  },
  // 监听全局数据变化
  onStoreChange(kvs, oldKvs) {
 
  },
  // 路由变化钩子
  onPageShow(page) {

  },
  // 前置路由守卫钩子， return boolean控制跳转页面
  beforePageEnter(option, pageConfig) {

  },
  async onLaunch() {
    // 获取storage
    const isLogin = this.getStorageSync('token') ? true : false
    // 修改全局数据
    this.setStore('isLogin', isLogin)
    if(!this.getStore('isLogin')){
      //打开一个新页面，等待并接收该页面关闭时的回传数据
     const acceptData = await this.openPage({ url: '/pages/login/index' })
     console.log(acceptData)
    }
  }
  // ...
})
```
```js
// pages/login/index.js
Page({
  // 声明事件监听器
  listeners: {},
  // 同步全局数据
  mixinStore: [
    'isLogin',
    // 与当前page data中的字段冲突，这里重命名
    'version -> appVersion'
  ],
  // 同步storage，假如此时storage中token字段的值为'abc'
  mixinStorage: ['token'],
  //storage变化监听
  onStorageChange(kvs, oldKvs){

  },
  //全局数据变化监听
  onStoreChange(kvs, oldKvs){

  },
  data: {
    total: 1,
    version: 'page-v0.5'
  },
  // 字段变化监听
  observers: {
    total(curVal, oldVal) {
      console.log('this.data.total被修改', curVal, oldVal)
    }
  },
  //计算属性
  computed: {
    totalText() {
      return `总共${this.data.total}件`
    }
  },
  onLoad() {
    console.log(this.data.isLogin) // false
    console.log(this.data.token) // 'abc'
    console.log(this.data.totalText) // '总共1件'
    console.log(this.data.version) // 'page-v0.5'
    console.log(this.data.appVersion) // 'app-v1.0'
  },
  handleTap() {
    if(!this.data.isLogin) {
      const token = await fetch('/login')
      // 派发一个事件
      this.fireEvent('loginOk', token) 
      // 修改storage
      this.setStorageSync('token', token)
      // 关闭页面并回传数据
      this.finish('这条信息将回传')
    }
  }
  // ...
})
```

## 快速入门文档
[快速入门文档](https://gitee.com/laivv/wxbuf/blob/master/docs/DOCS.md)

## API文档大全
[API文档大全](https://gitee.com/laivv/wxbuf/blob/master/docs/APIS.md)

## 演示小程序demo
[小程序demo](https://gitee.com/laivv/wxbuf/tree/master/examples/mini-app-demo)

## License

[MIT](https://opensource.org/licenses/MIT)
