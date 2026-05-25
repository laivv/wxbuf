# <center>wxbuf - v2.0[WIP]</center>

## 此分支版本为v2.0开发中的版本[WIP]  

目前重构了大部核心功能，敬请关注！    


轻量级的微信小程序状态管理与通信库   
---

v2.0新特性：
* 完全重构，解耦核心模块功能
* 引入插件化机制，支持用户自定义插件来扩展功能

---  
## 起步
在app.js文件头部引入:
```js
// app.js
import wxbuf from 'wxbuf'

App({
  globalData: {},
  onLaunch() {

  }
    //...
})
```

现在您可以自定义一个wxbuf插件:         
```js
// myPlugin.js
import { definePlugin } from "wxbuf"

export default definePlugin({
  targetHooks: {
    app_init (options) {
      this.extendApp(options)
    },
    page_init (options) {
      this.extendPage(options)
    },
    component_init (options) {
      this.extendCom(options)
    }
  },
  methods: {
    extendApp(options) {
      options.sayHello = function () {
        console.log("[app]- hello wxbuf plugin")
      }
    },
    extendPage(options) {
      options.sayHello = function () {
        console.log("[page]- hello wxbuf plugin")
      }
    },
    extendCom(options) {
      options.sayHello = function () {
        console.log("[com] - hello wxbuf plugin")
      }
    }
  }
})

```

然后在app.js中引入插件:   
```js
import wxbuf from "wxbuf"
import myPlugin from "./myPlugin"

// 注册插件
wxbuf.usePlugin(myPlugin)

App({
  onLaunch () { }
  //...
})
```   

在app中调用插件方法:     
```js 
// ...
App({
  onShow () {
    this.sayHello() //  "[app] - hello wxbuf plugin"
  }
})
```
在页面中调用插件方法:     
```js 
// pageA.js
Page({
  onLoad () {
    this.sayHello() //  "[page] - hello wxbuf plugin"
  }
})
```
在组件中调用插件方法: 
```js
// comA.js
Component({
  lifetimes: {
    attached () {
      this.sayHello() //  "[com] - hello wxbuf plugin"
    }
  }
})
```


## 快速入门文档
[快速入门文档](../../blob/master/docs/DOCS.md)

## API文档大全
[API文档大全](../../blob/master/docs/APIS.md)

## 演示小程序demo
[小程序demo](../../tree/master/examples/mini-app-demo)

## License

[MIT](https://opensource.org/licenses/MIT)
