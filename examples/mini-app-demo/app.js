import wxbuf from './lib/wxbuf.min'

// 定义顶级全局变量，其它page或组件无需import可直接使用
wxbuf.global.extend('getAppName', function () {
  return '这段文字由app.js中定义的全局方法提供'
})
// 给所有page实例扩展公共方法
wxbuf.page.extend({
  showToast(title) {
    wx.showToast({
      title,
      icon: 'none'
    })
  }
})
// 对小程序的各种生命周期或事件进行监听
wxbuf.watch({
  onAppLaunch: function (argv) {
    // console.log('onAppLaunch', argv)
  },
  onAppShow: async function () {
    // console.log('onAppShow')
  },
  onAppHide: function () {
    // console.log('onAppHide')
  },
  onPageLoad: function (option) {
    // console.log('onPageLoad:', option)
  },
  onPageShow: function (option) {
    // console.log('onPageShow:', option)
  },
  onPageScroll: function (option) {
    // console.log('onPageScroll:', option)
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
    // console.log('onLongtap:', option)
  },
  onTouchstart: function (option) {
    // console.log('onTouchstart:', option)
  },
  onTouchmove: function (option) {
    // console.log('onTouchmove:', option)
  },
  onTouchend: function (option) {
    // console.log('onTouchend:', option)
  },
  onTouchcancel: function (option) {
    // console.log('onTouchcancel:', option)
  },
  onTouchforcechange: function (option) {
    // console.log('onTouchforcechange:', option)
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
})

// 全局配置
wxbuf.config({
  // 开启自动反序列化url参数
  parseUrlArgs: true,
  // 给wxbuf提供的实例或wx对象上的方法添加前缀，用于防止冲突
  methodPrefix: '',
  // 开启所有页面分享给好友
  enableGlobalShareAppMessage: true,
  // 开启所有页面分享到朋友圈
  enableGlobalShareTimeline: true,
  // 指定app中哪个key值被作为store数据来管理
  storeKey: 'globalData',
})

App({
  // 全局注入store到所有页面、组件的实例上
  injectStore: {
    // 注入到实例的命名空间（前缀）
    namespace: '$store',
    // 注入store中的哪些字段
    keys: ['appVersion', 'appCount'],
  },
  // 全局注入storage到所有页面、组件
  injectStorage: {
    namespace: '$storage',
    keys: ['count'],
  },
  listeners: {
    dataChange(event) {
      wx.showToast({
        title: `此窗由app.js弹出！收到'dataChange'事件`,
        icon: 'none'
      })
    }
  },
  globalData: {
    appVersion: 'v1.0',
    appCount: 0
  },
  onPageShareAppMessage(page, options, object) {
  },
  onPageShareTimeline(page, options) {
  },
  onPageLoad(page, options) {
  },
  onPageShow(page) {
  },
  onPageUnload(page) {
  },
  beforePageEnter(option, config) {
    if (config.requiredAuth) {
      wx.showModal({ title: '你没有权限访问该页面', showCancel: false })
      return false
    }
  },
  onEventDispatch(event, next) {
    const { dataset } = event.currentTarget
    if (dataset.notAllowed) {
      return wx.showToast({
        title: '你没有此操作权限',
        icon: 'error'
      })
    }
    // 给目标handler传递第二个参数，减少取dataset的解构层数
    next(event, dataset)
  },
  onComponentCreated(com) {
  },
  onComponentAttached(com) {
  },
  onComponentReady(com) {
  },
  onComponentDetached(com) {
  },
  onStoreChange(newVal, oldVal) {
    console.log('来自App.js的消息,全局数据改变了, 新旧值分别是:', newVal, oldVal)
  },
  onStorageChange(newVal, oldVal) {
    console.log('来自App.js的消息,storage数据改变了, 新旧值分别是:', newVal, oldVal)
  }
})