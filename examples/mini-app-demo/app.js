import wxbuf from './lib/wxbuf.min'

wxbuf.global.extend('getAppName', function () {
  return '我的小程序'
})

wxbuf.page.extend({
  closePage() {
    wx.navigateBack()
  }
})

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

wxbuf.config({
  parseUrlArgs: true,
  methodPrefix: '',
  // 开启所有页面分享功能
  enableGlobalSharePage: false,
})

App({
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
    appCount: 1
  },
  beforePageEnter(option, config) {
    if (config.requiredAuth) {
      wx.showModal({ title: '你没有权限访问该页面', showCancel: false })
      return false
    }
  },
  onUIEventDispatch(event, next) {
    if (event.currentTarget.dataset.permission) {
      return wx.showToast({
        title: '你没有此操作权限',
        icon: 'error'
      })
    }
    // 给目标handler传递第二个参数，减少取dataset的解构层数
    next(event, event.currentTarget.dataset)
  },
  onGlobalDataChange(newVal, oldVal) {
    console.log('来自App.js的消息,全局数据改变了, 新旧值分别是:', newVal, oldVal)
  },
  onStorageChange(newVal, oldVal) {
    console.log('来自App.js的消息,storage数据改变了, 新旧值分别是:', newVal, oldVal)
  }
})