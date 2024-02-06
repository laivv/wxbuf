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

### 【新增】Page实例方法
* [***invoke*** (`fnName`: string, `...args`: any[]): `any`](#invoke) 尝试调用opener页面的方法   
### 【新增】Component实例方法
* [***getPageInstance*** (): `pageInstance`](#getPageInstance) 获取所在页面的实例
* [***getUrlParams*** (): `object`](#getUrlParams) 获取所在页面的url参数(同page的onLoad钩子回调参数一致，只能在ready之后调用)
* [***invoke*** (`fnName`: string, `...args`: any[]): `any`](#invoke) 尝试调用所在页面的opener页面的方法
### 【新增】Page(option)构造器选项
* [***option.computed*** ](#computed) 声明计算属性
* [***option.observers*** ](#observers) 声明字段变化监听器
* [***option.listeners*** ](#listeners) 声明全局事件监听器
* [***option.onWakeup*** ](#onWakeup) 非首次onShow时调用
* [***option.onSwitchTab*** ](#onSwitchTab) 当页面是tabbar时，在非首次onShow页面时调用，可接收参数
* [***option.mixinGlobalData*** ](#mixin-global-data) 混入globalData并保持一致
* [***option.mixinStorage*** ](#mixin-storage) 混入storage并保持一致
* [***option.onGlobalDataChange*** ](#on-global-data-change) 监听globalData变化
* [***option.onStorageChange*** ](#on-storage-change) 监听storage变化
* [***option.provide*** ](#provide) 向后代组件提供数据
### 【新增】Component(option)构造器选项
* [***option.computed***  ](#computed) 声明计算属性
* [***option.listeners***  ](#listeners) 声明全局事件监听器
* [***option.mixinGlobalData***  ](#mixin-global-data) 混入globalData并保持一致
* [***option.mixinStorage***  ](#mixin-storage) 混入storage并保持一致
* [***option.onGlobalDataChange*** ](#on-global-data-change) 监听globalData变化
* [***option.onStorageChange*** ](#on-storage-change) 监听storage变化
* [***option.pageLifeTimes.pullDownRefresh*** ](#pull-down-refresh) 所在页面onPullDownRefresh
* [***option.pageLifeTimes.reachBottom*** ](#reach-bottom) 所在页面onReachBottom
* [***option.pageLifeTimes.pageScroll*** ](#page-scroll) 所在页面onPageScroll
* [***option.pageLifeTimes.switchTab*** ](#com-switchTab) 所在tabbar页面发生onSwitchTab时调用   
* [***option.pageMethods*** ](#page-methods) 向所在页面安装方法
* [***option.provide*** ](#provide) 向后代组件提供数据
* [***option.inject*** ](#inject) 获取来自上层组件提供的数据（配合provide使用）
### 【新增】Behavior(option)构造器选项
* [***option.computed***  ](#computed) 声明计算属性
* [***option.listeners***  ](#listeners) 声明全局事件监听器
* [***option.mixinGlobalData***  ](#mixin-global-data) 混入globalData并保持一致
* [***option.mixinStorage***  ](#mixin-storage) 混入storage并保持一致
* [***option.onGlobalDataChange*** ](#on-global-data-change) 监听globalData变化
* [***option.onStorageChange*** ](#on-storage-change) 监听storage变化
* [***option.pageLifeTimes.pullDownRefresh*** ](#pull-down-refresh) 所在页面onPullDownRefresh
* [***option.pageLifeTimes.reachBottom*** ](#reach-bottom) 所在页面onReachBottom
* [***option.pageLifeTimes.pageScroll*** ](#page-scroll) 所在页面onPageScroll
### 【新增】App(option)构造器选项
* [***option.listeners***  ](#listeners) 声明全局事件监听器
* [***option.onGlobalDataChange*** ](#on-global-data-change) 监听globalData变化
* [***option.onStorageChange*** ](#on-storage-change) 监听storage变化
* [***option.beforePageEnter*** ](#before-route-enter) 新页面加载前进行回调
* [***option.onPageLoad*** ](#onPageLoad) 页面onLoad进行回调
* [***option.onPageShow*** ](#on-route-change) 页面onShow时回调
* [***option.onPageShareAppMessage*** ](#onPageShareAppMessage) 当页面分享给好友时进行回调，可劫持并修改参数
* [***option.onPageShareTimeline*** ](#onPageShareTimeline) 当页面分享到朋友圈时进行回调，可劫持并修改参数
* [***option.onUIEventDispatch*** ](#onUIEventDispatch) UI标准事件触发时的前置拦截器
### 【新增】wx对象上新增工具方法
* [***wx.openPage*** (`option`: object): `promise` ](#wx-open-page) 打开一个页面
* [***wx.replacePage*** (`option`: object): `void` ](#wx-replace-page) 打开一个页面替换当前页面栈
* [***wx.finish*** (`value`?: any): `void`  ](#wx-finish) 关闭当前页面
* [***wx.getGlobalData*** (`key`: string): `any`  ](#wx-get-global-data) 获取全局数据
* [***wx.setGlobalData*** (`key`: string, `value`: any): `any`  ](#wx-set-global-data) 设置全局数据
* [***wx.getNavigateBarTitle*** (): `string`  ](#getNavigateBarTitle) 获取当前页的导航栏title
* [***wx.getTabBarPages*** (): `string[]`  ](#getTabBarPages) 获取tabbar的页面路径列表
* [***wx.isTabBarPage*** (`url`: string): `boolean`  ](#isTabBarPage) 判断一个url是否是tabbar页面
* [***wx.getConfigJson*** (`url`: string): `object`  ](#getConfigJson) 获取页面的原始json文件信息
* [***wx.fireEvent*** (`eventName`: string, `value`: any): `void`  ](#fire-event) 派发一个事件（同实例fireEvent方法）
### 【更新】wx对象
* [***wx.switchTab*** (`option`: object): `void` ](#wx-switch-tab) switchTab现在支持在url上携带query参数
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
### 【新增】全局方法   
* [***getApplication():AppInstance***](#getapplication) 获取app实例
* [***getSavedPages():page[]***](#getsavedpages) 获取所有未销毁的page实例
### 【新增】全局配置 wxbuf.config(option)
* [***option.parseUrlArgs***](#global-config) 是否开启自动反序列化url参数
* [***option.methodPrefix***](#global-config) 给wxbuf提供的实例或wx对象上的方法添加前缀
* [***option.enableGlobalShareAppMessage***](#global-config) 是否开启所有页面分享给好友
* [***option.enableGlobalShareTimeline***](#global-config) 是否开启所有页面分享到朋友圈
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
  也可以使用`wx.fireEvent`，但推荐优先使用实例上的`fireEvent`，这样便于追踪事件是从哪个页面或组件发出来的，`wx.fireEvent`无法做到这一点，`wx.fireEvent`更适合在没有`this`上下文的js文件中使用   

  例子：
  ```js
  //request.js
  http.response.intercepter.use(res => {
    if(res.code === 403) {
      wx.fireEvent('loginOut')
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
    body: { name: "wxbuf" } // 使用body传递参数，此方式通过内存传递参数，而不是走url传参，可方便的传递大量数据，并且没有序列化开销，使用page默认的分享小程序给微信好友时可能存在丢失参数，需要开发者自行处理
  })
  ```
  ```js
  // /pages/detail/index
  Page({
    onLoad(option) {
      console.log(option.id) // "123"
      console.log(option.name) // "wxbuf"
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
      // 访问被打开page，给其设置字段值
      page.setData({ age: 18 })
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
    // 使用body方式代替url传递参数
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
<a id="invoke"></a>

* ***invoke*** (`fnName`: string, ...args: any[]): `any`   
  适用于： `page`、 `component`  

  说明：尝试调用opener页面的方法  
  例子：

  ```js
  // pages/pageA/index.js
  // opener页面
  Page({
    data: {
      selected: null
    },
    handleTap() {
      this.openPage({
        url: '/pages/select/index',
      })
    },
    onSelect(selected) {
      this.setData({ selected })
    }
  })
  ```  

  ```js
  // pages/select/index.js
  // 子页面
  Page({
    handleItemTap(item){
      this.invoke('onSelect', item)
    }
  })
  ```  
  `opener`是指打开前当页面的页面，类似于浏览器js环境中的`window.opener`；使用`openPage`打开新页面可以建立`opener`关系，使用`reLaunch`或`redirectTo`等会替换当前页面栈的方法无法建立`opener`关系，
  注意：`invoke`方法仅仅是尝试调用，若不存在`opener`页面或`opener`页面不存在对应的方法，也不会抛错，这比较适用于父子页面的数据多次回传的场景    

<a id="getPageInstance"></a>

* ***getPageInstance*** (): `page`   
  适用于： `component`  

  说明：获取当前组件所在页面的实例    

  例子：

  ```html
  <!-- pageA.wxml -->
  <comA />
  ```

  ```js
  // pageA.js
  Page({
    getUserId() {
      return '1'
    }
  })
  ```  
  ```json
  /** pageA.json **/
  {
    "usingComponents": {
     "comA": "./comA/index"
    }
  }
  ```

  ```js
  // ./comA/index.js
  Component({
    handleItemTap(item){
     console.log(this.getPageInstance().getUserId()) // '1'
    }
  })
  ```  
<a id="getUrlParams"></a>    

* ***getUrlParams*** (): `object`   
  适用于： `component`  

  说明：获取当前组件所在页面的url参数，获取的结果同所在页面的生命周期`onLoad(options)`的回调参数`options`一致   

  注意： 请在组件的`ready`生命周期及其之后再获取url参数，在`created`、`attached`中无法获得正确结果


  例子：
  
  ```js
  // pageA.js
  Page({
    handleTap() {
      wx.navigateTo({
        url: "/pages/detail/index?a=1&b=2"
      })
    }
  })
  ```

  ```html
  <!-- /pages/detail/index.wxml -->
  <comA />
  ```

  ```js
  // /pages/detail/index.js
  Page({
    onLoad(options) {
      console.log(options.a) // '1'
      console.log(options.b) // '2'
    }
  })
  ```  
  ```json
  /** /pages/detail/index.json **/
  {
    "usingComponents": {
     "comA": "./comA/index"
    }
  }
  ```

  ```js
  // ./comA/index.js
  Component({
    lifetimes: {
      ready() {
        const urlParams = this.getUrlParams()
        console.log(urlParams.a) // '1'
        console.log(urlParams.b) // '2'
      }
    }
  })
  ```  
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
  注意：`observers`只能对单一的`key`进行响应，暂不支持对`key`路径响应

  以下是一个正反例子：    

  ```js
  Page({
    data: {
      obj: {
        count: 1
      }
    }
    observers: {
      // 正确
      obj(newVal, oldVal) {
       
      },
      // 错误
      'obj.count': function(newVal, oldVal) {
       
      },
    },
    onLoad() {
      // 正确，observers正确响式
      this.setData({ obj: { count: 2 } })
      // 错误，此方式observers不会响式
      this.setData({ 'obj.count': 2 })
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

<a id="onWakeup"></a>
  
* ***option.onWakeup*** : `()=> void`  
  适用于：  `page` 

  说明：页面非首次`onShow`时调用，和`onShow`唯一的区别是`onShow`是每次都会调用，而`onWakeup`则在第二次及以后才会调用    

<a id="onSwitchTab"></a>
  
* ***option.onSwitchTab*** : `(options: object) => void`  
  适用于：  `page` 

  说明：若当前页面是`tabbar`页面，在第二次及之后页面`onShow`的时候会调用此钩子，并且此钩子可以接收来自`wx.switchTab`的参数传递；非tabbar页面此钩子不会调用

  例子：  

  ```js
  // /pageA.js
  Page({
    // 第一次点击
    handleFirstTap() {
      wx.switchTab({
        url: '/pages/my/index?a=1'
      })
    },
    // 第二次点击
    handleSecondTap() {
      wx.switchTab({
        url: '/pages/my/index?a=2'
      })
    },
  })
  ```

  ```js
  // /pages/my/index.js
  // 此页面是tabbar页面
  Page({
    // 首次进入页面在onLoad钩子接收wx.switchTab参数
    onLoad(options) {
      console.log(options.a) // '1'
    },
    // 非首次(第二次onShow及之后)在onSwitchTab钩子接收wx.switchTab参数
    onSwitchTab(options) {
      console.log(options.a) // '2'
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

<a id="provide"></a>

* ***option.provide: object | () => object***    
  适用于： `page` 、`component`    

  说明：向后代组件提供数据，用于跨层级透传数据    

  `provide`可以指定为一个普通对象或者一个函数，如果是函数，则必须返回一个对象

  例子：
  
  ```js
  Page({
    provide: {
      rootName: '这是page数据'
    }
  })
  ```
  或者

  ```js
  Page({
    provide() {
      return {
        rootName: '这是page数据'
      }
    }
  })
  ```

<a id="inject"></a>

* ***option.inject: string[]***    
  适用于： `component`    

  说明：获取来自上层组件提供的数据   


  例子：

  ```js
  // 页面
  Page({
    provide: {
      rootName: '这是page数据',
      sayHello() {
        console.log('hello')
      }
    }
  })
  ```
  ```js
  // 子组件
  Component({
    inject: ['rootName', 'sayHello'],
    lifetimes: {
      attached(){
        console.log(this.data.rootName) // '这是page数据'
        this.sayHello() // 'hello'
      }
    }
  })
  ```
  从上面的例子可以看出，`inject`引用的字段值如果是非函数，则会挂载到`this.data`上，否则挂载到`this`上。    

  如果上层数据是变动的，并且后代组件需要同步，此时上层组件的`provide`应当指定为一个函数而不是一个对象

  例子：

  ```js
  // 页面
  Page({
    data: {
      number: 1
    },
    provide() {
      return {
        pageNumber: this.data.number
      }
    }
  })
  ```
  ```js
  // 子组件
  Component({
    inject: ['pageNumber'],
    lifetimes: {
      attached(){
        console.log(this.data.pageNumber) // 1
      }
    }
  })
  ```
  要注意的是，小程序中的父子组件关系并不是`jsx`中的那种父子标签（slot）嵌套的关系，而是父组件在`json`文件中的`usingComponents`里导入了某个子组件，并且在`wxml`里使用了子组件，这样即形成父子组件关系，而将组件标签嵌套进另一个组件的`slot`中并不形成父子关系。    

  另一个要注意的是，只能在组件的`attached`及其之后的生命周期才能获取到通过`inject`注入的上层数据，因为只有在`attached`阶段才能确定其父组件是谁，在`created`阶段由于无法确定父组件，所以无法获取到通过`inject`注入的上层数据   

  例子：

  ```js
  // 页面
  Page({
    data: {
      number: 1
    },
    provide() {
      return {
        pageNumber: this.data.number
      }
    }
  })
  ```
  ```js
  // 子组件
  Component({
    inject: ['pageNumber'],
    lifetimes: {
      created() {
        console.log(this.data.pageNumber) // undefined
      }
      attached(){
        console.log(this.data.pageNumber) // 1
      }
    }
  })

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

<a id="com-switchTab"></a>
  
* ***option.pageLifeTimes.switchTab*** : `(options: object) => void`  
  适用于：  `component` 

  说明：若当前组件所在页面是`tabbar`页面，在页面第二次及之后`onShow`的时候会调用此钩子，并且此钩子可以接收来自`wx.switchTab`的参数传递；非tabbar页面此钩子不会调用

  例子：  

  ```js
  // /pageA.js
  Page({
    // 第一次点击
    handleFirstTap() {
      wx.switchTab({
        url: '/pages/my/index?a=1'
      })
    },
    // 第二次点击
    handleSecondTap() {
      wx.switchTab({
        url: '/pages/my/index?a=2'
      })
    },
  })
  ```

  ```js
  // /pages/my/index.js
  // 此页面是tabbar页面
  Page({
    // 首次进入页面在onLoad钩子接收wx.switchTab参数
    onLoad(options) {
      console.log(options.a) // '1'
    },
    // 非首次(第二次onShow及之后)在onSwitchTab钩子接收wx.switchTab参数
    onSwitchTab(options) {
      console.log(options.a) // '2'
    }
  })
  ```
  ```js
  // 此组件在 /pages/my/index 页面中使用
  Component({
    lifetimes: {
      // 首次在ready钩子及之后的生命周期通过this.getUrlParams()获取wx.switchTab参数
      // 在ready之前的生命周期调用this.getUrlParams()不会得到正确结果
      ready() {
        const urlParams = this.getUrlParams()
        console.log(urlParams.a) // '1'
      }
    },
    pageLifetimes: {
      // 非首次onShow在switchTab钩子接收wx.switchTab参数 
      switchTab(options) {
        console.log(options.a) // '2'
      }
    }
  })
  ```
  为什么`pageLifetimes.switchTab`不设计成每次切入tabbar页面时都调用呢？这是因为很多组件并不会在页面初次打开时就存在，可能要等到调用接口后才会展示出来，此时已经错过了所在tabbar页面的`onSwitchTab`生命周期，所以这种设计机制和小程序组件内置的生命周期（如`pageLifetimes.show`）保持一致

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

  说明：打开新页面前进行回调（路由守卫功能）, 可返回`布尔值`决定是否拦截页面    
  参数：`option`为要打开的页面相关信息,    
  参数：`pageConfig`为要打开页面的原始.json文件内容信息，利用此信息可以做个性化的路由拦截（如权限控制）      
  注意：只能拦截通过js调用打开的页面，正常启动或通过外链启动进入的页面无法拦截    

<a id="onPageLoad"></a>

* ***option.onPageLoad(option)： void***    
  适用于： `app`  

  说明：页面onLoad时回调    

  参数：`option`为页面的信息   

<a id="on-route-change"></a>

* ***option.onPageShow(page)： void***    
  适用于： `app`  

  说明：页面onShow时回调    

  参数：`page`为相应的页面  

<a id="onPageShareAppMessage"></a>

* ***option.onPageShareAppMessage(`page`: page, `options`: object, `object`: object)： object | undefined***    
  适用于： `app`  

  说明：页面`onShareAppMessage`时调用， 可以返回一个`object`来劫持修改原始的分享信息，若不返回数据，则表示不修改原始分享信息

  参数：`page`为对应的页面    
  参数：`options`为对应的页面执行`onShareAppMessage`后返回的数据    
  参数：`object`为对应的页面的`onShareAppMessage`原始的回调参数   

  注意：此钩子并不能阻止页面的分享功能，仅仅是在分享发生时提供统一修改的机会  

<a id="onPageShareTimeline"></a>

* ***option.onPageShareTimeline(`page`: page, `options`: object)： object | undefined***    
  适用于： `app`  

  说明：页面`onShareTimeline`时调用， 可以返回一个`object`来劫持修改原始的分享信息，若不返回数据，则表示不修改原始分享信息

  参数：`page`为对应的页面    
  参数：`options`为对应的页面执行`onShareTimeline`后返回的数据    

  注意：此钩子并不能阻止页面的分享功能，仅仅是在分享发生时提供统一修改的机会    

<a id="onUIEventDispatch"></a>

* ***option.onUIEventDispatch(`event`: event, `next`: Function)： void***    
  适用于： `app` 

  说明：对于视图层绑定的事件`handler`进行统一的前置处理，此钩子可以拦截页面上所有视图层绑定的事件回调的执行

  参数：`event`为原始的event对象  
  参数：`next`是一个方法， 若调用，则表示继续执行绑定的原始`handler`，否则拦截      

  例子：

  ```js
  //app.js
  App({
    onUIEventDispatch(event, next) {
      const { dataset } = event.currentTarget
      if (dataset.notAllowed) {
        return wx.showToast({
          title: '你没有此操作权限',
          icon: 'error'
        })
      }
      // 给目标handler传递第二个参数，减少目标handler取dataset的解构层数
      // 注意，目标handler的第一个参数原封不动传回去，因为绑定的事件第一个参数原本就是event，若强行改动容易出现问题
      next(event, dataset)
    }
  })
  ```

  ```xml
  <!-- pageA.wxml -->
  <view bindtap="handleA" data-name="123">正常执行</view>  
  <view bindtap="handleB" data-not-allowed >无操作权限</view>  
  ```

  ```js
  // pageA.js
  Page({
    // 正常执行
    handleA(event, dataset) {
      wx.showToast({
        title: '执行成功',
        icon: 'none'
      })
      console.log(dataset.name) // '123'
    }
    // 被拦截，无法执行
    handleB() {
      wx.showToast({
        title: '执行成功',
        icon: 'none'
      })
    }
  })
  ```


##  【增加】wx对象增加工具方法

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

<a id="getNavigateBarTitle"></a>

* ***wx.getNavigateBarTitle*** (): `string`  

  说明：获取当前页面的导航栏title，不适用于自定义导航栏，此方法返回不是很准确，建议暂不使用

<a id="getTabBarPages"></a>

* ***wx.getTabBarPages*** (): `string[]`  

  说明：获取所有tabbar页面的url列表   

<a id="isTabBarPage"></a>

* ***wx.isTabBarPage*** (`url`: string): `boolean`  

  说明：判断一个路径url是否是tabbar页面 

<a id="getConfigJson"></a>

* ***wx.getConfigJson*** (`url`: string): `object`  

  说明：获取页面对应的json文件内容，目前仅能获取到主包中页面的json信息，不稳定，不建议使用

## 【更新】wx
<a id="wx-switch-tab"></a>

* ***wx.switchTab(`options`: object)***   

  说明：此方法现在支持在`url`上携带`query`参数    
  例子：
  ```js
    wx.switchTab({
      url: '/pages/index/index?a=1&b=2'
    })
  ``` 
  注意：首次打开目标tabbar页面请在`onLoad`钩子中接收参数，如果目标tabbar页面已经打开过（实例未销毁），此时`switchTab`跳转过去请在`onSwitchTab`钩子中接收参数；由于受限于小程序，url上并不会体现出来query参数，但并不影响实际使用

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

## 【新增】全局方法
<a id="getapplication"></a>

* ***getApplication(): AppInstance***   

  说明：获取app实例，效果同`getApp()`一样，区别是小程序自带的`getApp`在`App`的`onLaunch`钩子中返回`undefined`，而`getApplication()`能够正确返回实例

<a id="getsavedpages"></a>

* ***getSavedPages(): page[]***   

  说明：获取所有未销毁的页面实例，类似于`getCurrentPages()`，区别是`getCurrentPages()`获取的是页面栈，对于已经打开过多个tabbar页面并不能获取到，而`getSavedPages()`可以获取

<a id="global-config"></a>

## 全局配置
```js
// app.js
import wxbuf  from './utils/wxbuf'

wxbuf.config({
  // 开启自动反序列化url参数
  parseUrlArgs: true,
  // 给wxbuf提供的实例或wx对象上的方法添加前缀，用于防止冲突
  methodPrefix: '',
  // 开启所有页面分享给好友（优先使用页面自己的分享函数）
  enableGlobalShareAppMessage: true,
  // 开启所有页面分享到朋友圈（优先使用页面自己的分享函数）
  enableGlobalShareTimeline: true,
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

