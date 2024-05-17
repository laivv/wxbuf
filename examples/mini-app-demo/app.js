import { usePlugin, definePlugin } from './lib/wxbuf.min'

const myplugin = definePlugin({
  options: {
    target: 'app',
  },
  lifetimes: {
    init(options) {
      debugger
    },
    onLaunch(options) {
      debugger
    },
    onLaunch_end() {
      debugger
    },
    onShow() {
      debugger
    }
  }
})
const myplugin2 = definePlugin({
  options: {
    target: 'app',
  },
  lifetimes: {
    init(options) {
      var a = options
      debugger
    },
    onLaunch(options) {
      var b = options
      debugger
    },
    onShow() {
      debugger
    }
  }
})
const myplugin3 = definePlugin({
  options: {
    target: 'page',
  },
  data: {
    a: 1
  },
  lifetimes: {
    init(options) {
      var a = options
      debugger
    },
    setData(options) {
      var b = options
      this.$target.setData({ c: 3 })
      debugger
    },
    setData_end() {
      var b = [].slice.call(arguments, 0)
      this.showToas()
      debugger
    },
    onShow() {
      debugger
    }
  },
  methods: {
    showToas() {
      wx.showToast({title: 'plugins-toast'})
    }
  }
})

// usePlugin(myplugin)
// usePlugin(myplugin2)
// usePlugin(myplugin3)

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
    debugger
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