# <center>wxbuf.js API文档</center>
wxbuf.js是一款微信小程序javascript库，对小程序原生API进行了扩展，增加了以下功能
* 支持全局状态管理（任意页面或组件引用的globalData自动保持一致）
* 支持storage管理（任意页面或组件引用的storage自动保持一致）
* 支持更易用的跨组件跨页面通信方式，彻底解决通信问题
* 支持globalData、storage变化监听
* 更方便的page间数据传递方式
* Page、Component支持computed计算属性
* Page支持observers字段监听器
* 自动解析page路径参数中的json、number、null、undefined、array字段，在onLoad钩子中自动接收解析后的参数
* 支持全局生命周期监听
* 支持全局路由前置守卫钩子、路由变化钩子，方便路由级权限控制
* 支持全局view标准事件拦截，方便按钮级权限控制
* 全局开启所有页面的分享功能
* Component支持更多pageLifeTimes
* Component支持向所在的page安装方法
* 全局扩展page、component的实例方法
* 支持定义顶级全局变量
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
      this.setGlobalData('isLogin', kvs.token ? true : false)
    }
  },
  // 监听globalData变化
  onGlobalDataChange(kvs, oldKvs) {
 
  },
  // 路由变化钩子
  onPageChange(page) {

  },
  // 前置路由守卫钩子， return boolean控制跳转页面
  beforePageEnter(option, pageConfig) {

  },
  async onLaunch() {
    // 获取storage
    const isLogin = this.getStorageSync('token') ? true : false
    // 修改全局数据
    this.setGlobalData('isLogin', isLogin)
    if(!this.globalData.isLogin){
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
  // 同步globalData
  mixinGlobalData: [
    'isLogin',
    // 与当前page data中的字段冲突，这里重命名
    'version -> appVersion'
  ],
  // 同步storage，假如此时storage中token字段的值为'abc'
  mixinStorage: ['token'],
  //storage变化监听
  onStorageChange(kvs, oldKvs){

  },
  //globalData变化监听
  onGlobalDataChange(kvs, oldKvs){

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
---
## <center>API目录</center>
### 【新增】Page、App、Component、Behavior实例方法
* [***fireEvent*** (`eventName`: string, `value`: any): `void`](#fire-event) 派发一个事件
* [***openPage*** (`option`: object): `promise`](#open-page)打开新页面
* [***replacePage*** (`option`: object): `void`](#replace-page) 打开新页面替换当前页面栈 
* [***finish***(`value`?: any): `void`](#finish)  关闭当前页面
* [***getGlobalData*** (`key`: string): `any`](#get-global-data)   获取globalData
* [***setGlobalData*** (`key`: string, `value`: any): `void`](#set-global-data) 设置globalData
* [***setStorage*** (`option`: object): `void`](#set-storage) 异步设置storage
* [***removeStorage*** (`option`: object): `void`](#remove-storage)  异步移除storage
* [***getStorageSync*** (`key`: string): `any`](#get-storage-sync) 同步获取storage
* [***setStorageSync*** (`key`: string, `value`: any): `void`](#set-storage-sync) 同步设置storage
* [***removeStorageSync*** (`key`: string): `void`](#remove-storage-sync) 同步移除storage
* [***batchSetStorage*** (`option`: object): `void`](#batch-set-storage) 异步批量设置storage
* [***batchSetStorageSync*** (`kvList`: array): `void`](#batch-set-storage-sync) 同步批量设置storage
* [***clearStorage*** (): `void`](#clear-storage) 异步清空storage
* [***clearStorageSync*** (): `void`](#clear-storage-sync) 同步清空storage
### 【新增】Page(option)
* [***option.computed*** ](#computed) 声明计算属性
* [***option.observers*** ](#observers) 声明字段变化监听器
* [***option.listeners*** ](#listeners) 声明全局事件监听器
* [***option.onWakeup*** ](#onwakeup) 非首次onShow时调用
* [***option.mixinGlobalData*** ](#mixin-global-data) 混入globalData并保持一致
* [***option.mixinStorage*** ](#mixin-storage) 混入storage并保持一致
* [***option.onGlobalDataChange*** ](#on-global-data-change) 监听globalData变化
* [***option.onStorageChange*** ](#on-storage-change) 监听storage变化
### 【新增】Component(option)
* [***option.computed***  ](#computed) 声明计算属性
* [***option.listeners***  ](#listeners) 声明全局事件监听器
* [***option.mixinGlobalData***  ](#mixin-global-data) 混入globalData并保持一致
* [***option.mixinStorage***  ](#mixin-storage) 混入storage并保持一致
* [***option.onGlobalDataChange*** ](#on-global-data-change) 监听globalData变化
* [***option.onStorageChange*** ](#on-storage-change) 监听storage变化
* [***option.pageLifeTimes.pullDownRefresh*** ](#pull-down-refresh) 所在页面onPullDownRefresh
* [***option.pageLifeTimes.reachBottom*** ](#reach-bottom) 所在页面onReachBottom
* [***option.pageLifeTimes.pageScroll*** ](#page-scroll) 所在页面onPageScroll
* [***option.pageMethods*** ](#page-methods) 向所在页面安装方法
### 【新增】Behavior(option)
* [***option.computed***  ](#computed) 声明计算属性
* [***option.listeners***  ](#listeners) 声明全局事件监听器
* [***option.mixinGlobalData***  ](#mixin-global-data) 混入globalData并保持一致
* [***option.mixinStorage***  ](#mixin-storage) 混入storage并保持一致
* [***option.onGlobalDataChange*** ](#on-global-data-change) 监听globalData变化
* [***option.onStorageChange*** ](#on-storage-change) 监听storage变化
* [***option.pageLifeTimes.pullDownRefresh*** ](#pull-down-refresh) 所在页面onPullDownRefresh
* [***option.pageLifeTimes.reachBottom*** ](#reach-bottom) 所在页面onReachBottom
* [***option.pageLifeTimes.pageScroll*** ](#page-scroll) 所在页面onPageScroll
### 【新增】App(option)
* [***option.listeners***  ](#listeners) 声明全局事件监听器
* [***option.onGlobalDataChange*** ](#on-global-data-change) 监听globalData变化
* [***option.onStorageChange*** ](#on-storage-change) 监听storage变化
* [***option.beforePageEnter*** ](#before-route-enter) 新页面加载前进行回调
* [***option.onPageChange*** ](#on-route-change) 路由发生变化时回调
* [***option.onUIEventDispatch*** ](#on-uievent-dispatch) UI标准事件触发时的前置拦截器
### 【新增】wx
* [***wx.openPage*** (`option`: object): `promise` ](#wx-open-page) 打开一个页面
* [***wx.replacePage*** (`option`: object): `void` ](#wx-replace-page) 打开一个页面替换当前页面栈
* [***wx.finish*** (`value`?: any): `void`  ](#wx-finish) 关闭当前页面
* [***wx.getGlobalData*** (`key`: string): `any`  ](#wx-get-global-data) 获取全局数据
* [***wx.setGlobalData*** (`key`: string, `value`: any): `any`  ](#wx-set-global-data) 设置全局数据
### 【新增】全局监听器 `wxbuf.watch(option)`
* [***option.onAppLaunch***](#watch)
* [***option.onAppShow***](#watch)
* [***option.onAppHide***](#watch)
* [***option.onPageLoad***](#watch)
* [***option.onPageShow***](#watch)
* [***option.onPageScroll***](#watch)
* [***option.onPageReachBottom***](#watch)
* [***option.onPagePullDownRefresh***](#watch)
* [***option.onTap***](#watch)
* [***option.onLongtap***](#watch)
* [***option.onLongpress***](#watch)
* [***option.onTouchstart***](#watch)
* [***option.onTouchmove***](#watch)
* [***option.onTouchend***](#watch)
* [***option.onTouchcancel***](#watch)
* [***option.onTouchforcechange***](#watch)
* [***option.onInput***](#watch)
* [***option.onFocus***](#watch)
* [***option.onBlur***](#watch)
* [***option.onConfirm***](#watch)
### 【新增】全局配置
* [***wxbuf.config(option: object)***](#global-config)
### 【新增】全局扩展
* [***wxbuf.global.extend(`varname`: string, `value`: any)***](#global-extend)  定义顶级全局变量
* [***wxbuf.page.extend(`option`: object)***](#page-extend) 给所有page实例扩展方法
* [***wxbuf.component.extend(`option`: object)***](#component-extend) 给所有component实例扩展方法

-----------

# <center>API详细介绍</center>
## 【增加】实例方法
<a id="fire-event"></a> 

* ***fireEvent*** (`eventName`: string, `value`: any): `void`   
  适用于： `app` 、`page`、 `component`、 `behavior`    

  说明：触发一个全局事件，`app`、`page`、`component`、`behavior`中只要声明了[listeners](#listeners)并且有对应的事件处理方法，就可以收到事件回调   

  参数： `eventName`事件名 ； `value`要传递的数据

  例子：  
  ```js
  // pageA.js
  Page({
    listeners: {
      updateOk(event) {
        console.log(event)
      }
    }
  })
  ```
  ```js
  // pageB.js
  Page({
    handleBtnTap() {
      this.fireEvent('updateOk', 'hello')
    }
  })
  ```

<a id="open-page"></a> 

* ***openPage*** (`option`: openPageOption): `promise`    
  适用于： `app` 、`page`、 `component`、 `behavior`   

  说明：打开一个新的页面，可用于代替`wx.navigateTo`。  

  参数：`option` 的类型`openPageOption`定义如下   
  ```ts
  type openPageOption = { 
    // 跳转页面的name，必须保证整个app唯一，与url二选一
    name?: string,
    // 跳转页面的url，必须以/开头，与name二选一
    url?: string, 
    // 跳转页面的query参数，拼接在url后面
    params?: {[key: string]: any } 
    // 使用body方式代替url传递参数【慎用】
    body?: any, 
    // 成功的回调, 回调参数`page`为被打开页面的代理对象（非原始的page实例），利用该对象可访页面实例的所有属性和方法
    success?: (page) => void 
  }
  ```
  以下是使用`name`来跳转页面【新特性】      

  例子：  
 
  ```js
  // /pages/detail/index.json
  {
    "name": "详情页", // 定义name字段，必须整个app全局唯一
    "navigationBarTitleText": "数据详情",
    "usingComponents": {
    }
  }
  ```
  ```js
  // 打开 /pages/detail/index?id=123
  this.openPage({
    name: '详情页',
    params: { id: "123" }, // 传递url参数
    body: { name: "wxbuf" } // 使用body传递参数，尽量不要用此方式传递参数，否则小程序转发给微信好友时因url上不存在body参数导致问题
  })
  ```
  ```js
  // /pages/detail/index
  Page({
    onLoad(option) {
      console.log(option.id) // "123"
      console.log(option.name) // { name: "wxbuf" }
    }
  })
  ```
  以上通过`name`即可打开`/pages/detail/index`这个页面，并没有像`wx.navigateTo`一样需要指定`url`字段，这种方式的优点是当你调整了某个`page`的目录结构，无需修改整个项目中需要跳转这个`page`的`url`

  也可以通过常规的指定`url`字段来打开页面，以下是一个例子

  例子：
  ```js
  this.openPage({
    // 不同于wx.navigateTo, openPage 要求url必须以根路径/开头
    url: '/pages/pagesB/index?name=wxbuf',
    params: { id: '123' }, // 最终生成 /pages/pagesB/index?name=wxbuf&id=123
    success(page) {
      // 利用page对象可以访问被打开page的属性和方法
      page.setData({ name: '123' })
    }
  })
  ```
  注意：使用`success`回调时，如果子页面（被打开页）已经关闭，则不应再通过代理对象访问子页面的任何属性或方法，否则将会抛出错误。也就是说，确保在子页面未关闭时才可以通过代理对象访问该页面的属性或方法。     

  `openPage`还可以接收来自被打开页面回传的数据，这需要配合[finish](#finish)方法来传递数据  

  例子：
  ```js
  // pageA.js
  Page({
    async handleTap() {
      // 等待接收被打开页回传数据
      const acceptData = await this.openPage({ url: '/pages/detail/index' })
      console.log(acceptData) // '这是回传数据'
    }
  })
  ```
  ```js
  // pages/detail/index.js
  Page({
    async handleOk() {
      // 调用finish方法回传数据给父page，并且关闭当前页面
      this.finish('这是回传数据')
    }
  })
  ```
<a id="replace-page"></a> 

* ***replacePage*** (`option`: replacePageOption): `void`    
  适用于： `app` 、`page`、 `component`、 `behavior`    

  说明：打开一个新的页面替换当前页面栈，可用于代替`wx.redirectTo`。 

  参数：`option` 的类型`replacePageOption`定义如下   
  ```ts
  type replacePageOption = { 
    // 跳转页面的name，必须保证整个app唯一，与url二选一
    name?: string,
    // 跳转页面的url，必须以/开头，与name二选一
    url?: string, 
    // 跳转页面的query参数，拼接在url后面
    params?: {[key: string]: any } 
    // 使用body方式代替url传递参数【慎用】
    body?: any, 
  }
  ```
  
  例子：

  ```js
  this.replacePage({
    url: '/pages/pagesB/index',
    params: { id: 'xxx' }，
  })
  ```
<a id="finish"></a>

* ***finish***(`value`?: any): void   
  适用于： `page`、 `component`、 `behavior`    

  说明：关闭当前页面并返回上一个页面，可代替`wx.navigateBack`    

  参数：`value`为可选参数，表示向前一个页面回传的数据，回传数据功能需要配合[openPage](#open-page)方法一起使用

  例子：

  ```js
  // pageA.js
  Page({
    async handleBtnTap(){
      const acceptData = await this.openPage({ url: '/page/pageB/index' })
      console.log(acceptData) // '这是回传数据'
    }
  })
  ```
  ```js
  // /page/pageB/index.js
  Page({
    handleOk() {
      this.finish('这是回传数据')
    }
  })
  ```
  <a id="get-global-data"></a>
* ***getGlobalData*** (`key`: string): `any`    
  适用于：`app` 、 `page`、 `component`、 `behavior`   

  说明：获取全局数据(`globalData`) ,  相当于 `getApp().globalData[key]` 的效果

  例子：
  ```js
  // app.js
  App({
    globalData: {
      count: 1
    }
  })
  ```
  ```js
  // page.js
  Page({
    handleTap() {
      const count = this.getGlobalData('count') // 相当于getApp().globalData.count
      console.log(count) // 1
    }
  })
  ```
  也可以用 [wx.getGlobalData](#wx-get-global-data)  来获取`globalData`

<a id="set-global-data"></a> 

* ***setGlobalData*** (`key`: string, `value`: any): `void`   
  适用于： `app` 、`page`、 `component`、 `behavior`     

  说明：设置全局数据(`globalData`)    

  例子：
  ```js
  // app.js
  App({
    globalData: {
      count: 1
    }
  })
  ```
  ```js
  // page.js
  Page({
    handleTap() {
      this.setGlobalData('count', 2)
      console.log(getApp().globalData.count) // 2
    }
  })
  ```
  也可以用[wx.setGlobalData](#wx-set-global-data)来设置`globalData`   

<a id="set-storage"></a>

* ***setStorage*** (`option`: object): `void`   
  适用于： `app` 、`page`、 `component`、 `behavior`   

  说明：异步设置`storage`, 可代替`wx.setStorage`    

<a id="remove-storage"></a>

* ***removeStorage*** (`option`: object): `void`   
  适用于： `app` 、`page`、 `component`、 `behavior`  

  说明：异步移除某个`storage`, 可代替`wx.removeStorage`   

<a id="get-storage-sync"></a>

* ***getStorageSync*** (`key`: string): `any`   
  适用于： `app` 、`page`、 `component`、 `behavior`  
    
  说明：同步获取`storage`, 可代替`wx.getStorageSync`

<a id="set-storage-sync"></a>

* ***setStorageSync*** (`key`: string, `value`: any): `void`   
  适用于： `app` 、`page`、 `component`、 `behavior`  

  说明：同步设置`storage`, 可代替`wx.setStorageSync`    

<a id="remove-storage-sync"></a>

* ***removeStorageSync*** (`key`: string): `void`   
  适用于： `app` 、`page`、 `component`、 `behavior`  

  说明：同步移除某个`storage`, 可代替`wx.removeStorageSync`   
<a id="batch-set-storage"></a>

* ***batchSetStorage*** (`option`: object): `void`   
  适用于： `app` 、`page`、 `component`、 `behavior`  

  说明：异步批量设置`storage`, 可代替`wx.batchSetStorage`   

<a id="batch-set-storage-sync"></a>

* ***batchSetStorageSync*** (`kvList`: array): `void`   
  适用于： `app` 、`page`、 `component`、 `behavior`  

  说明：同步批量设置`storage`, 可代替`wx.batchSetStorageSync`       

<a id="clear-storage"></a>

* ***clearStorage*** (): `void`   
  适用于： `app` 、`page`、 `component`、 `behavior`  

  说明：异步清空`storage`, 可代替`wx.clearStorage`     

<a id="clear-storage-sync"></a>

* ***clearStorageSync*** (): `void`   
  适用于： `app` 、`page`、 `component`、 `behavior`  

  说明：同步清空`storage`, 可代替`wx.clearStorageSync`    
## 【增加】构造器option

<a id="computed"></a>

* ***option.computed*** : `object`     
  适用于： `page`、 `component`、 `behavior`  

  说明：计算属性，类似于`vue`的`computed`功能，`computed`中声明的字段通过计算会在`this.data`中生成对应的字段   

  例子：

  ```html
  <view>{{ ageDesc }}</view>
  ```
  ```js
  // page.js
  Page({
    data: {
      age: 18
        // 这里会生成 ageDesc
    }
    computed: {
      // 将在this.data中生成ageDesc
      ageDesc() {
        return '你的年龄是' + this.data.age
      }
    },
    handleTap() {
      this.setData({ age: 19 })
      console.log(this.data.ageDesc) // 你的年龄是19
    }
  })
  ```
<a id="observers"></a>
  
* ***option.observers*** : `object`     
  适用于： `page`   

  说明：监听data对象中某个字段值的变化，和`compontent`中的`observers`功能一样  

  例子：
  ```js
  Page({
    data: {
      count: 1
    }
    observers: {
      count(newVal, oldVal) {
        //...
      }
    },
    handleTap() {
      this.setData({ count: 2 })
    }
  })
  ```
<a id="listeners"></a>
  
* ***option.listeners*** : `object`  
  适用于： `app`、 `page` 、`component` 、`behavior`  

  说明：声明事件监听器，可以方便的跨页跨组件通信   

  例子：
  ```js
  // pageA.js
  Page({
    listeners: {
      updateOk(event) {
        console.log(event) 
      },
      loginSuccess(event) {
        console.log(event)
      }
    }
  })
  ```
  ```js
  //pageB.js
  Page({
    handleLogin() {
      this.fireEvent('loginSuccess')
    }
  })
  ```
  ```js
  // componentC.js
  Component({
    methods: {
      handleBtnTap() {
        this.fireEvent('updateOk', '这是数据')
      }
    }
  })
  ```   

<a id="mixin-global-data"></a>    

* ***option.mixinGlobalData*** : `array<string>`   
  适用于： `page` 、`component` 、`behavior`   

  说明：将`App`中`globalData`的值`混入`到当前实例的data字段中并且保持同步， 和[mixinStorage](#mixin-storage)的机制一样   

  例子：  

  ```js
  // app.js
  App({
    globalData: {
      count: 1,
      appVersion: '1.0'
    }
  })
  ```

  ```js
  // page.js
  Page({
    mixinGlobalData: ['count', 'appVersion'],
    onLoad() {
      console.log(this.data.count) // 1
      console.log(this.data.appVersion) // '1.0'
    },
    handleTap() {
      this.setGlobalData('count', 2)
      console.log(this.data.count) // 2
      console.log(this.getGlobalData('count')) // 2
      console.log(getApp().globalData.count) // 2
    }
  })
  ```
  `globalData`中的`key`名称可能与当前实例的`data`字段中的`key`重名，此时`mixinGlobalData`可以重命名，方式是将  `mixinGlobalData`指定的`array`中需要重命名的成员项写成`key->newKey`的形式   

  例子：
  ```js
  // app.js
  App({
    globalData: {
      count: 1,
      appVersion: '1.1'
    }
  })
  ```

  ```js
  // page.js
  Page({
    mixinGlobalData: [
      'count->number', // 当前page的data对象中含有同名字段 `count`， 所以这里将count重命名为number
      'appVersion'
    ],
    data: {
      count: 10
    },
    onLoad() {
      console.log(this.data.count) // 10
      console.log(this.data.number) // 1
      console.log(this.data.appVersion) // '1.1'
    },
    handleTap() {
      this.setGlobalData('count', 2)
      console.log(this.data.count) // 10
      console.log(this.data.number) // 2
      console.log(this.getGlobalData('count')) // 2
      console.log(getApp().globalData.count) // 2
    }
  })
  ```
<a id="mixin-storage"></a>

* ***mixinStorage*** : `array<string>`  
  适用于： `page` 、`component` 、`behavior`   

  说明：将`storage`的值`混入`到当前实例的data字段中并且保持同步，和[mixinGlobalData](#mixin-global-data)的机制一样      

  例子：  

  ```js
  // 假如 storage中 count=1, isLogin=true
  // page.js
  Page({
    mixinStorage: ['count', 'isLogin'],
    onLoad() {
      console.log(this.data.count) // 1
      console.log(this.data.isLogin) // true
    },
    handleTap() {
      this.setStorageSync('count', 2)
      console.log(this.data.count) // 2
      console.log(this.getStorageSync('count')) // 2
      console.log(wx.getStorageSync('count')) // 2
    }
  })    
  ```   
  `storage`中的`key`名称可能与当前实例的`data`字段中的`key`重名，此时`mixinStorage`可以重命名，方式是将 `mixinStorage`指定的`array`中需要重命名的成员项写成`key->newKey`的形式    

  例子：

  ```js
  // 假如 storage中 count=1
  // page.js
  Page({
    mixinStorage: [
      'count->number', // 将count重命名为number
      'isLogin'
    ],
    data: {
      count: 10
    },
    onLoad() {
      console.log(this.data.count) // 10
      console.log(this.data.number) // 1
    },
    handleTap() {
      this.setStorageSync('count', 2)
      console.log(this.data.count) // 10
      console.log(this.data.number) // 2
      console.log(this.getStorageSync('count')) // 2
      console.log(wx.getStorageSync('count')) // 2
    }
  })
  ```
## 【增加】一些钩子
<a id="on-storage-change"></a>

* ***option.onStorageChange(`kvs`: object, `oldKvs`: object)***   
 适用于： `app`、 `page` 、`component`、 `behavior`     

  说明：当`storage`更新时进行回调，
  回调参数：`kvs`为新值对象， `oldKvs`为旧值对象  

  例子：
  ```js
  // 假如 storage中 count = 1

  // pageA.js
  Page({
    onStorageChange(kvs, oldKvs) {
      console.log(kvs) 
      console.log(oldKvs) 
    }
  })
  ```
  ```js

  // componentC.js
  Component({
    onStorageChange(kvs, oldKvs) {
      console.log(kvs) 
      console.log(oldKvs)
    }
  })
  ```
  ```js
  // pageB.js
  Page({
    onLoad() {
      this.setStorageSync('count', 2)
    }
  })
  ```   


<a id="on-global-data-change"></a>

* ***option.onGlobalDataChange(`kvs`: object, `oldKvs`: object)***    
  适用于： `app`、 `page` 、`component`、 `behavior`    

  说明：当`globalData`更新时进行回调，
  回调参数：`kvs`为新值， `oldKvs`为旧值   

  例子：
  ```js
  //app.js
  App({
    globalData: {
      count: 1
    }
  })
  ```
  ```js
  // pageA.js
  Page({
    onGlobalDataChange(kvs, oldKvs) {
      console.log(kvs) 
      console.log(oldKvs) 

    }
  })
  ```
  ```js
  // componentC.js
  Component({
    onGlobalDataChange(kvs, oldKvs) {
      console.log(kvs) 
      console.log(oldKvs)

    }
  })
  ```
  ```js
  // pageB.js
  Page({
    onLoad() {
      this.setGlobalData('count', 2)
    }
  })
  ```

<a id="pull-down-refresh"></a>

* ***option.pageLifeTimes.pullDownRefresh(): void***   
  适用于： `component`、`behavior`    

  说明：所在页面`onPullDownRefresh`时回调  
 
<a id="reach-bottom"></a>

* ***option.pageLifeTimes.reachBottom(): void***   
  适用于： `component`、`behavior`    

  说明：所在页面`onReachBottom`时回调  

<a id="page-scroll"></a>

* ***option.pageLifeTimes.pageScroll(e): void***   
  适用于： `component`、`behavior`    

  说明：所在页面`onPageScroll`时回调， 注意：不要大量使用此钩子，否则将引发性能问题

<a id="page-methods"></a>

* ***option.pageMethods: object***   
  适用于： `component`   

  说明：向所在的page实例挂载方法    

  例子：    

  ```js
  // 组件 list.js
  Component({
    pageMethods: {
      // 此方法将挂载到使用此组件的page的this对象上
      refreshList() {
        this.getData()
      }
    },
    methods: {
      getData() {
        console.log('组件-获取数据中')
      }
    }
  })
  ```
  ```json
  // page.json

  {
    "usingComponents": {
      "list": "./list"
    }
  }
  ```
  ```html
  <!--page.wxml -->
  <list></list>
  ```
  ```js
  // page.js
  Page({
    handleTap() {
      this.refreshList() // 组件-获取数据中
    }
  })
  ```
  注意，如果组件所在page已有同名方法，则不会向该page挂载方法；如果组件被page使用多次，则只会挂载第一个组件的方法，所以要向page挂载方法就要避免组件在同一个page中被多次使用，以防引起混乱。

<a id="before-route-enter"></a>

* ***option.beforePageEnter(`option`: object, `pageConfig`: object): boolean | undefined***  

  适用于： `app`    

  说明：打开新页面前进行回调（路由守卫功能）, 可返回`布尔值`决定是否继续打开页面    
  参数：`option`为要打开的页面相关信息,    
  参数：`pageConfig`为要打开页面的原始.json文件内容信息    

<a id="on-route-change"></a>

* ***option.onPageChange(page)： void***    
  适用于： `app`  

  说明：当路由发生变化时回调    

  参数：`page`为相应的页面

##  【增加】wx.静态方法

<a id="wx-open-page"></a>

* ***wx.openPage*** (`option`: object): `promise`  

  说明：打开新页面， 效果与实例方法[openPage](#open-page)一样， 可代替`wx.navigateTo`

<a id="wx-replace-page"></a>

* ***wx.replacePage*** (`option`: object): `void`  

  说明：打开新页面替换当前页面栈，效果与实例方法[replacePage](#replace-page)一样，可代替`wx.redirectTo`

<a id="wx-finish"></a>

* ***wx.finish*** (`value`?: any): `void`  

  说明：关闭当前页面，效果与实例方法[finish](#finish)一样，可代替`wx.navigateBack`

<a id="wx-get-global-data"></a>

* ***wx.getGlobalData*** (`key`: string): `any`  

  说明：获取全局数据(globalData)，效果与实例方法[getGlobalData](#get-global-data)一样

<a id="wx-set-global-data"></a>

* ***wx.setGlobalData*** (`key`: string, `value`: any): `void`  

  说明：修改全局数据(globalData)，效果与实例方法[setGlobalData](#set-global-data)一样

<a id="watch"></a>    

## 全局监听器
```js
//app.js
import wxbuf  from './utils/wxbuf'

wxbuf.watch({
  onAppLaunch: function (option) {
    console.log('onAppLaunch', option)
  },
  onAppShow: async function () {
    console.log('onAppShow')
  },
  onAppHide: function () {
    console.log('onAppHide')
  },
  onPageLoad: function (option) {
    console.log('onPageLoad:', option)
  },
  onPageShow: function (option) {
    console.log('onPageShow:', option)
  },
  onPageScroll: function (option) {
    console.log('onPageScroll:', option)
  },
  onPageReachBottom: function (option) {
    console.log('onPageReachBottom:', option)
  },
  onPagePullDownRefresh: function (option) {
    console.log('onPagePullDownRefresh:', option)
  },
  onTap: function (option) {
    console.log('onTap:', option)
  },
  onLongpress: function (option) {
    console.log('onLongpress:', option)
  },
  onLongtap: function (option) {
    console.log('onLongtap:', option)
  },
  onTouchstart: function (option) {
    console.log('onTouchstart:', option)
  },
  onTouchmove: function (option) {
    console.log('onTouchmove:', option)
  },
  onTouchend: function (option) {
    console.log('onTouchend:', option)
  },
  onTouchcancel: function (option) {
    console.log('onTouchcancel:', option)
  },
  onTouchforcechange: function (option) {
    console.log('onTouchforcechange:', option)
  },
  onInput: function (option) {
    console.log('onInput:', option)
  },
  onFocus: function (option) {
    console.log('onFocus:', option)
  },
  onBlur: function (option) {
    console.log('onBlur:', option)
  },
  onConfirm: function (option) {
    console.log('onConfirm:', option)
  },
})

App({
  globalData: {},
  onLaunch() {}
  // ...
})
```
<a id="global-config"></a>

## 全局配置
```js
// app.js
import wxbuf  from './utils/wxbuf'

wxbuf.config({
  // 自动解析页面路径中的json、number、array类型参数，并且在页面onLoad的时候拿到已经处理过的参数
  parseUrlArgs: true,
  // 方法前缀 将影响实例方法和wx.静态方法
  methodPrefix: '$', // e.g： this.$fireEvent， wx.$finish
  // 开启所有页面分享功能（优先使用页面自己的分享功能）
  enableGlobalSharePage: true,
})

App({
  globalData: {},
  onLaunch() {}
  // ...
})
```
<a id="global-extend"></a>

## 全局扩展   
* ***wxbuf.global.extend(`varName`: string, `value`: any): void***   

  说明：定义顶级全局变量。    
  此方法定义的全局变量在其它page或component中可以直接使用，无需import   

  例子：    
  ```js
  // app.js
  import wxbuf  from './utils/wxbuf'

  wxbuf.global.extend('util', {
    say() {
      console.log('这是全局工具方法')
    }
  })

  App({
    globalData: {},
    onLaunch() {}
    // ...
  })
  ```
  ```js
  // pageA.js
  Page({
    onLoad() {
      util.say() // 这是全局工具方法
    }
  })
  ```
<a id="page-extend"></a>

* ***wxbuf.page.extend(`option`: object): void***   

  说明：给所有page实例扩展方法。    

  例子：    
  ```js
  // app.js
  import wxbuf  from './utils/wxbuf'

  wxbuf.page.extend({
    getData(key){
      return this.data[key]
    }
  })

  App({
    globalData: {},
    onLaunch() {}
    // ...
  })
  ```
  ```js
  // pageA.js
  Page({
    data: {
      name: 'wxbuf is a library'
    },
    onLoad() {
      const name = this.getData('name') 
      console.log(name) // 'wxbuf is a library' 
    }
  })
  ```
<a id="component-extend"></a>

* ***wxbuf.component.extend(`option`: object): void***   

  说明：给所有component实例扩展方法。    
  效果与[wxbuf.page.extend](#page-extend)一样



      




