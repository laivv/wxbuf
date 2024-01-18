import wxbuf from './lib/wxbuf.min'

wxbuf.global.extend('getAppName', function() {
  return '我的小程序'
})

wxbuf.page.extend({
  say() {
    console.log('这个方法将挂展到所有page的实例上')
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
    // console.log('onPageReachBottom:', option)
  },
  onPagePullDownRefresh: function (option) {
    // console.log('onPagePullDownRefresh:', option)
  },
  onTap: function (option) {
    // console.log('onTap:', option)
  },
  onLongpress: function (option) {
    // console.log('onLongpress:', option)
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
    // console.log('onInput:', option)
  },
  onFocus: function (option) {
    // console.log('onFocus:', option)
  },
  onBlur: function (option) {
    // console.log('onBlur:', option)
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
  },
  globalData: {
    appVersion: 'v1.0',
    appCount: 1
  },
  onPageLoad() {
  },
  beforePageEnter(option, pageConfig) {
    if (pageConfig.requiredAuth) {
      wx.showModal({ title: '你没有权限访问该页面', showCancel: false })
      return false
    }
  },
  onPageChange(page) {
  },
  onUIEventDispatch(e, next) {
    if (e.currentTarget.dataset.auth) {
     return wx.showToast({
        title: '你没有此操作权限',
        icon: 'error'
      })
    } 
    next(e, Object.assign({}, e.currentTarget.dataset, e.detail.value ? { value: e.detail.value } : {}))
  },
  onGlobalDataChange(newVal, oldVal) {
    console.log('来自App.js的消息,全局数据改变了, 新旧值分别是:', newVal, oldVal)
  },
  onStorageChange(newVal, oldVal) {
    console.log('来自App.js的消息,storage数据改变了, 新旧值分别是:', newVal, oldVal)
  }
})