

# 快速入门

  此文档仅介绍较常用的功能，要查看所有api，请查看[API文档大全](https://gitee.com/laivv/wxbuf/blob/master/APIS.md)


## 跨组件通信

  需要跨组件或者跨页通信时，在构造器选项中配置`listeners`字段来指定事件接收函数，通过实例方法`fireEvent`来触发一个事件

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

## 页面间数据传递，数据回传

  使用实例方法`openPage`来打开新页面，新页面通过实例方法`finish`来关闭自身页面并回传数据给上一个页面，`finish`方法包括了关闭页面（`wx.navigateBack`）与回传数据两项功能于一身 

  例子：
  ```js
  // pageA.js
  Page({
    async handleTap() {
      const acceptVal = await this.openPage({ 
        url: '/pages/detail/index?name=wxbuf',
        // 使用params字段传递参数，会追加在url后面，最终生成 /pages/detail/index?name=wxbuf&id=123
        params: { id: '123' },
        // 使用body字段传递参数
        body: { value: 1 },
        success(page) {
          // 给被打开page设置字段
          page.setData({ age: 18 })
        }
      })
      console.log(acceptVal) // '这是回传数据'
    }
  })
  ```
  ```js
  // pages/detail/index.js
  Page({
    onLoad({ name, id, value }) {
      console.log(name) // 'wxbuf'
      console.log(id) // '123'
      console.log(value) // 1
    },
    async handleOk() {
      console.log(this.data.age) // 18
      // 调用finish方法回传数据给父page，并且关闭当前页面
      this.finish('这是回传数据')
    }
  })
  ```
  因此，可以指定`params`字段来代替字符串拼接，并且`params`中的字段还可以是对象，比自己拼接更方便；`body`方式则是通过内存传递参数

## 获取globalData全局数据

  我们提供了实例方法`getGlobalData`来获取全局数据 ，可以代替 `getApp().globalData[key]` 

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

## 修改全局数据

  使用实例方法`setGlobalData`来修改全局数据以获得响应式更新   

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

## 使用全局状态（数据），响应式更新！
  
  在构造器选项中配置`mixinGlobalData`字段来将`globalData`的值设置到当前实例的data字段中，并且后续一直保持同步，即依赖的globalData的`key`值一但变化，当前实例引用的值也跟着变化！    
  如果需要实时保持一致，应当用此方式代替传统的`getGlobalData(key)`或`getApp().globalData.xxx`的取值方式

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
 
## 使用storage状态（数据），响应式更新！

在构造器选项中配置`mixinStorage`字段来将`storage`的值设置到当前实例的data字段中，并且后续一值保持同步，这和`mixinGlobalData`的机制一样，如果需要实时保持一致，应该放弃使用传统的`wx.getStorage`、`wx.getStorageSync`来取值，而应该用此方式

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
 
## 可以对globalData和storage进行变化监听！

  你可能不需要响应式的`storage`和`globalData`，但需要监听它们的变化，因此`wxbuf`提供了`onStorageChange`与`onGlobalDataChange`回调钩子，可以使用它们来监听变化

  例子：
  ```js

  Page({
    onStorageChange(kvs, oldKvs) {
      console.log(kvs) 
      console.log(oldKvs) 
    },
    onGlobalDataChange(kvs, oldKvs) {
      console.log(kvs) 
      console.log(oldKvs) 
    }
  })
  ```
## 跨级传递数据

  微信小程序中并没有提供跨越组件层级传递数据的方法，要给嵌套较深的组件传递数据只能一层层定义`properties`来传递，这非常难受，不过`wxbuf`提供了跨级传递数据的方法，通过`provide`与`inject`来进行跨级数据的传递，如果你了解vue，就知道vue也是通过这种方式来实现跨级传递数据的    

  例子：

  ```js
  // 宿主页面
  Page({
    provide: {
      rootName: '这是page数据',
      rootFn() {
        console.log('this is rootFn')
      }
    }
  })
  ```
  ```js
  // 子组件
  Component({
    inject: ['rootName', 'rootFn'],
    lifetimes: {
      attached(){
        console.log(this.data.rootName) // '这是page数据'
        this.rootFn() // 'this is rootFn'
      }
    }
  })
  ```
   从上面的例子可以看出，`inject`引用的字段值如果是非函数，则会挂载到`this.data`上，否则挂载到`this`上。      

  `provide`除了可以写成对象以外，还可以写成函数的形式，该函数必须返回一个对象，这样就成为响应式的`provide`，即后代组件引用来自上层组件的数据发生变化后，自身也会同步该值 

  例子：

  ```js
  // 宿主页面
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
  要注意的是，小程序中的父子组件关系并不是`jsx`中的那种父子标签（slot）嵌套的关系，而是父组件在`json`文件中的`usingComponents`里导入了某个子组件，并且在`wxml`里使用了子组件，这样即形成父子组件关系，而将组件标签放在另一个组件的`slot`中并不形成父子关系    

  另一个要注意的是，只能在组件的`attached`及其之后的生命周期才能获取到`inject`的数据，因为只有在`attached`阶段才能确定其父组件是谁

## 计算属性

  在构造器选项中声明`computed`字段来实现计算属性，计算属性字段会在`this.data`中生成对应的字段，这和`vue`中的`computed`一样

  例子：

  ```html
  <view>{{ ageDesc }}</view>
  ```
  ```js
  Page({
    data: {
      age: 18
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

## page observers
  page支持`observers`了，在构造器选项中声明`observers`来监听`data`对象中某个字段值的变化，和`compontent`中的`observers`功能一样  

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


## 全局路由拦截

  在`app`文件中通过`beforePageEnter`可以进行全局路由守卫，返回`布尔值`来决定是否拦截某个页面
  
  例子：
  ```js
  App({
 
    beforePageEnter() {
      return false
    }
  
  })
  ```
  注意的是，`beforePageEnter`无法拦截`Launch`进来的页面，即无法拦截通过正常启动或外链打开小程序等其它非js调用进入的页面，只能拦截通过js调用打开的页面

## switchTab传参

`wx.switchTab`支持在`url`上携带`query`参数（原来是不支持的）  
  例子：
  ```js
    wx.switchTab({
      url: '/pages/index/index?a=1&b=2'
    })
  ``` 
  注意：首次打开目标tabbar页面请在`onLoad`钩子中接收参数，如果目标tabbar页面已经打开过（实例未销毁），此时`switchTab`跳转过去请在`onWakeUp`钩子中接收参数；由于受限于小程序，url上并不会体现出来query参数，但并不影响实际使用

  

## 全局顶层变量定义   

  可以在app中使用`wxbuf.global.extend`定义一些顶层全局变量，在其它文件中无需import即可使用  

  例子：    
  ```js
  // app.js
  import wxbuf  from './utils/wxbuf'

  wxbuf.global.extend('getAppVersion',function(){
    return 'v1.0.0'
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
      console.log(getAppVersion()) // 'v1.0.0'
    }
  })
  ```

## 全局给page或componet的实例挂载方法

  使用`wxbuf.page.extend` 或 `wxbuf.component.extend` 分别给`page`和`component`实例挂载公共方法


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


## 更多详细API请参考以下链接
[API文档大全](https://gitee.com/laivv/wxbuf/blob/master/APIS.md)
