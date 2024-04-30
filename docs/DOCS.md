

# 快速入门

  此文档仅介绍较常用的功能，要查看所有api，请查看[API文档大全](https://gitee.com/laivv/wxbuf/blob/master/docs/APIS.md)


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

## 获取全局数据

  我们提供了实例方法`getStore`来获取全局数据 ，可以代替 `getApp().globalData[key]` 

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
      const count = this.getStore('count') // 相当于getApp().globalData.count
      console.log(count) // 1
    }
  })
  ```

## 修改全局数据

  使用实例方法`setStore`来修改全局数据以获得响应式更新   

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
      this.setStore('count', 2)
      console.log(getApp().globalData.count) // 2
    }
  })
  ```

## 使用响应式的全局数据
  
  响应式全局数据的优点是可以自动更新视图，在构造器选项中配置`mixinStore`字段来将`store`的值设置到当前实例的data字段中，并且后续一直保持同步，即依赖的全局数据的`key`值一但变化，当前实例引用的值也跟着变化！    
  如果需要实时保持一致，应当用此方式代替传统的`getStore(key)`或`getApp().globalData.xxx`的取值方式

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
    mixinStore: ['count', 'appVersion'],
    onLoad() {
      console.log(this.data.count) // 1
      console.log(this.data.appVersion) // '1.0'
    },
    handleTap() {
      this.setStore('count', 2)
      console.log(this.data.count) // 2
      console.log(this.getStore('count')) // 2
      console.log(getApp().globalData.count) // 2
    }
  })
  ```
 
## 使用响应式的storage

响应式`storage`的优点是可以自动更新视图，在构造器选项中配置`mixinStorage`字段来将`storage`的值设置到当前实例的data字段中，并且后续一值保持同步，这和`mixinStore`的机制一样，如果需要实时保持一致，应该放弃使用传统的`wx.getStorage`、`wx.getStorageSync`来取值，而应该用此方式

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
 
## 对store和storage进行变化监听

  你可能不需要响应式的`storage`和`store`，但需要监听它们的变化，因此`wxbuf`提供了`onStorageChange`与`onStoreChange`回调钩子，可以使用它们来监听变化

  例子：
  ```js

  Page({
    onStorageChange(kvs, oldKvs) {
      console.log(kvs) 
      console.log(oldKvs) 
    },
    onStoreChange(kvs, oldKvs) {
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

## 页面的observers
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
  
## 全局对wxml视图层事件监听或拦截

可以在app.js中对所有的page和组件的视图层事件进行监听和拦截 

### 基础的监听
page.wxml:

```xml
  <view bindtap="handleTap" data-name="wxbuf"></view>
```
page.js:
```js
Page({
  handleTap(event) {
    //...
  }
})
```

app.js:
```js
// app.js
import wxbuf from 'wxbuf'

App({
  onEventDispatch(event, next) {
    console.log(event.currentTarget.dataset.name) // 'wxbuf'
    // 继续执行原始的事件handler
    next(event)
  },
})
```

当page中的`view`元素被点击时，会先调用`app`中的`onEventDispatch`钩子，`event`对象为原始的事件`event`，可以利用此对象获取被点击元素的信息，常见的应用场景如全局埋点上报功能。
`next`是一个函数，调用它并传入`event`对象让页面上的原始的事件`handler`正常执行，并且必须原封不动的传入`event`对象，否则可能引起原始的事件`handler`不能接收到`event`对象参数

### 对视图层事件进行拦截
page.wxml:

```xml
  <view bindtap="handleTap" data-not-allowed="{{true}}"></view>
```
page.js:

```js
Page({
  handleTap(event) {
    wx.showToast({ title: '正常执行' })
  }
})
```
app.js:
```js
// app.js
import wxbuf from 'wxbuf'

App({
  onEventDispatch(event, next) {
    if(event.currentTarget.dataset.notAllowed){
       wx.showToast({ title: '没有权限' })
       // 不调用next(event)则不执行原始的事件handler
    } else {
    // 继续执行原始的事件handler
      next(event)
    }
  },
})
```
当page中的`view`元素被点击时，会弹出`没有权限`的toast提示，原始的事件`handler`被拦截无法执行

### 减少event.currentTarget.dataset解构层数
日常开发中经常会在某个元素上自定义`data-`的数据，并在事件处理函数中通过`event.currentTarget.dataset.xxx`来获取这些数据，每次都很繁琐， 利用`onEventDispatch`钩子可以减少取`dataset`的层数   
page.wxml:

```xml
  <view bindtap="handleTap" data-name="wxbuf" data-id="123"></view>
```
page.js:
```js
Page({
  handleTap(e, { id, name }) {
    console.log(id) // 'wxbuf'
    console.log(name) // '123'
  }
})
```
app.js:
```js
// app.js
import wxbuf from 'wxbuf'

App({
  onEventDispatch(event, next) {
    // 将第二个参数传递给原始的事件handler
    next(event, event.currentTarget.dataset)
  },
})
```

## 类似vue中的 {{ var | filter }} 过滤器功能实现    

小程序中视图层变量绑定并没有过滤器功能，`wxs`的语法又比较受限，要想自己实现`{{ var | filter }}`这样的语法是不行的，但我们通过自定义一个组件能达到相似的过滤器效果

### 定义全局过滤器组件

在`app.json`中声明一个全局组件，就叫`c-text`，接下来实现这个组件：

c-text.wxml:
```xml
{{text}}
```

c-text.js:
```js

Component({
  externalClasses: ["class"],
  options: {
    virtualHost: true,
  },
  properties: {
    value: {
      optionalTypes: [String, Number, Object, Array, Boolean, null]
    },
    // 过滤器方法名
    filter: String,
    // 过滤器参数
    params: {
      optionalTypes: [String, Number, Object, Array, Boolean, null]
    }
  },
  observers: {
    "filter,params,value"() {
      this.render()
    },
  },
  lifetimes: {
    attached() {
      this.render()
    },
  },
  data: {
    text: "",
  },
  methods: {
    render() {
      const { value, filter, params } = this.data
      let text = value
      if (filter) {
        // 获取过滤器函数
        const handler = this.$parent[filter]
        const _params = Array.isArray(params) ? params : [params]
        if (handler) {
          text = handler.call(this.$parent, value, ..._params)
        }
      }
      this.setData({ text: text ?? "" })
    },
  },
})

```
现在我们就可以使用这个组件来使用过滤器功能了     
### 基出用法    
wxml:
```xml
<c-text value="{{timeStamp}}" />
```
```js
  Page({
    data: {
      timeStamp: 1714123672808
    }
  })
```
以上是一个普通的显示，和以下写法没什么区别:
```xml
{{timeStamp}}
```
### 指定过滤器
wxml: 
```xml
<c-text value="{{timeStamp}}" filter="formatDate" />
```
```js
Page({
  data: {
    timeStamp: 1714123672808
  },
  formatDate(value) {
    return dayjs(value).format('YYYY-MM-DD')
  }
})
```
### 指定过滤器的参数 
`params`属性指定传递给过滤器的参数    

wxml: 
```xml
<c-text value="{{timeStamp}}" filter="formatDate" params="YYYY-MM-DD HH:mm:ss" />
```
```js
Page({
  data: {
    timeStamp: 1714123672808
  },
  formatDate(value, format) {
    return dayjs(value).format(format)
  }
})
```
`params`属性也可以是一个数组:  
wxml: 
```xml
<c-text value="{{timeStamp}}" filter="formatDate" params="{{ ['YYYY-MM-DD HH:mm:ss', '-'] }}" />
```
```js
Page({
  data: {
    timeStamp: '',
  },
  formatDate(value, format, defaultValue) {
    return value ? dayjs(value).format(format) : defaultValue
  }
})
```

## switchTab传参

`wx.switchTab`支持在`url`上携带`query`参数（原来是不支持的）  

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
    // 非首次进入页面在onSwitchTab钩子接收wx.switchTab参数
    onSwitchTab(options) {
      console.log(options.a) // '2'
    }
  })
  ```
  注意：首次打开目标tabbar页面请在`onLoad`钩子中接收参数，如果目标tabbar页面已经打开过（实例未销毁），此时`switchTab`跳转过去请在`onSwitchTab`钩子中接收参数；由于受限于小程序，url上并不会体现出来query参数，但并不影响实际使用

  

## 全局顶层变量定义   

  可以在app中使用`wxbuf.global.extend`定义一些顶层全局变量，在其它文件中无需import即可使用  

  例子：    
  ```js
  // app.js
  import wxbuf  from 'wxbuf'

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
  import wxbuf from 'wxbuf'

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


## 演示小程序demo
[小程序demo](../../../tree/master/examples/mini-app-demo)

## 更多详细API请参考以下链接
[API文档大全](../../../blob/master/docs/APIS.md)
