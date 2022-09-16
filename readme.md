# wxbuf.js
wxbuf.js是一个轻量级的微信小程序三方库，它扩展了一些小程序不具备的方法，使原生开发更加方便

### 使用方法
将`wx-buf.js`放在`utils`目录里，然后在`app.js`中引入
```js
import wxBuf from 'utils/wx-buf.js'

App({
    globalData: {},
    onLaunch(){

    }
})
```

### page中增加了一些实例方法
```js
Page({
    data:{
       
    },
    //增加 - 用于将全局数据同步到Page的data中，可以在wxml直接使用，或通过this.data.xxx访问, -> 表示取别名（防止与page中的冲突）
    // e.g: page.data.userData= globalData.userData , page.data.phone = userPhone
    mixinGlobalData:['userData', 'userPhone -> phone'], 
    //增加 - 用于将storage中的数据同步到Page的data中，可以在wxml直接使用，或通过this.data.xxx访问， -> 表示取别名（防止与page中的冲突）
    // e.g: page.data.userId= globalData.userId , page.data.phone = userPhone
    mixinStorage:['userId', 'userPhone -> phone']
    onbuttonTap(){
        // 增加 - this.navigateTo方法，可代替wx.navigateTo
        this.navigateTo({   url: '/pages/detail/index'   })
        // 增加 - this.redirectTo方法，可代替wx.redirectTo
        this.redirectTo({    url: '/pages/detail/index'  })
        // 增加 - this.getGlobalData方法
        this.getGlobalData()
        // 增加 - this.setGlobalData方法
        this.setGlobalData()
        // 增加 - this.getStorageSync方法
        this.getStorageSync()
        // 增加 - this.setStorageSync方法
        this.setStorageSync()
        // 增加 - this.removeStorageSync方法
        this.removeStorageSync()
        // 增加 - this.fireEvent方法
        this.fireEvent()
    },
})
```

### app中增加了一些勾子方法
```js
App({
    //增加 - 在进入路由前调用， 通过return false 来阻止页面跳转(前提 ： 使用了this.navigateTo代替wx.navigateTo进行页面跳转)
    beforeRouteEnter(option){},
    //增加 -  当路由变化后
    onRouteChange(route){},
    //增加 -  当globalData发生变化时（前提 ：使用this.setGlobalData代替 getApp().globalData.xxx进行值的修改）
    onGlobalDataChange(key, newVal, oldVal){},
    //增加 -  当storage发生变化时（前提 ：使用this.setStorageSync代替 wx.setStorage[Sync]进行值的修改）
    onStorageChange(key, newVal, oldVal){}
})
```
### 许可
MIT