import { definePlugin } from "../core/index"

let onLaunchPromise = null

export default definePlugin({
  lifetimes: {
    app_init_end(options) {
      this.onLaunchDeferred(options)
      this.proxy(options, 'onShow')
      this.proxy(options, 'onShow')
      this.proxy(options, 'onHide')
      this.proxy(options, 'onError')
      this.proxy(options, 'onPageNotFound')
      this.proxy(options, 'onUnhandledRejection')
      this.proxy(options, 'onThemeChange')

    },
    page_init_end(options) {
      this.proxy(options, 'onLoad')
      this.proxy(options, 'onShow')
      this.proxy(options, 'onReady')
      this.proxy(options, 'onHide')
      this.proxy(options, 'onUnload')
      this.proxy(options, 'onRouteDone')
      this.proxy(options, 'onPullDownRefresh')
      this.proxy(options, 'onReachBottom')
      this.proxy(options, 'onPageScroll')
      this.proxy(options, 'onResize')
      this.proxy(options, 'onTabItemTap')
    },
    component_init_end(options) {
      this.proxy(options, 'created')
      this.proxy(options, 'attached')
      this.proxy(options, 'ready')
      this.proxy(options, 'moved')
      this.proxy(options, 'detached')
      this.proxy(options.lifetimes, 'created')
      this.proxy(options.lifetimes, 'attached')
      this.proxy(options.lifetimes, 'ready')
      this.proxy(options.lifetimes, 'moved')
      this.proxy(options.lifetimes, 'detached')
    },
    behavior_init_end(options) {
      this.proxy(options, 'created')
      this.proxy(options, 'attached')
      this.proxy(options, 'ready')
      this.proxy(options, 'moved')
      this.proxy(options, 'detached')
      this.proxy(options.lifetimes, 'created')
      this.proxy(options.lifetimes, 'attached')
      this.proxy(options.lifetimes, 'ready')
      this.proxy(options.lifetimes, 'moved')
      this.proxy(options.lifetimes, 'detached')
    }
  },
  methods: {
    onLaunchDeferred(options) {
      if (!options.onLaunch) return
      const self = this
      self.onLaunch = options.onLaunch
      options.onLaunch = function () {
        const res = self.onLaunch.apply(this, arguments)
        if (res instanceof Promise) {
          onLaunchPromise = res
          onLaunchPromise
          .then(() => {
            onLaunchPromise = null
          })
          .catch(() => {
            onLaunchPromise = null
          })
        }
        return res
      }
    },
    proxy(option, key) {
      const fn = option[key]
      if (!this.onLaunch || !fn) return
      option[key] = async function () {
        if (onLaunchPromise) {
          if (['onPullDownRefresh', 'onReachBottom', 'onPageScroll'].includes(key)) {
            return
          }
          await onLaunchPromise
        }
        fn.apply(this, arguments)
      }
    }
  }
})