import { definePlugin } from "../core/index"
import { noop } from "../util"
import { getPage } from "../utils/index"

export default definePlugin({
  lifetimes: {
    created() {
      this.enable = this.getConfig('pageOnInit') ?? true
    }
  },
  targetHooks: {
    page_init_end(options) {
      this.proxyOnInit(options)
      this.proxyOnLoad(options)
      this.proxyPage(options)
    },
    component_init_end(options) {
      this.proxyComponent(options)
    },
    behavior_init_end(options) {
      this.proxyBehavior(options)
    },
  },
  methods: {
    proxyOnInit(options) {
      const app = getApp()
      if (!app.onPageInit)
        return
      const onInit = options.onInit || noop
      options.onInit = async function () {
        await app.onPageInit.apply(app, arguments)
        return onInit.apply(this, arguments)
      }
    },
    proxyOnLoad(options) {
      const onLoad = options.onLoad || noop
      options.onLoad = async function () {
        if (!this.$$lock && options.onInit) {
          this.$$lock = options.onInit.apply(this, arguments)
        }
        if (this.$$lock) {
          await this.$$lock
        }
        if (this.$$childLocks) {
          this.$$childLocks.forEach(c => {
            if (c.$$behaviorUnLock) {
              c.$$behaviorUnLock()
            }
            c.$$unLock()
          })
        }
        if (this.$$behaviorUnLock) {
          this.$$behaviorUnLock()
        }
        return onLoad.apply(this, arguments)
      }
    },
    proxyPage(options) {
      this.lockPage('onShow', options, 'page')
      this.lockPage('onReady', options, 'page')
      this.lockPage('onHide', options, 'page')
      this.lockPage('onUnload', options, 'page')
      this.lockPage('onPullDownRefresh', options, 'page')
      this.lockPage('onReachBottom', options, 'page')
      this.lockPage('onPageScroll', options, 'page')
    },
    proxyComponent(options) {
      this.lockComponent('created', options)
      this.lockComponent('attached', options)
      this.lockComponent('ready', options)
      this.lockComponent('created', options.lifetimes)
      this.lockComponent('attached', options.lifetimes)
      this.lockComponent('ready', options.lifetimes)
      this.lockComponent('show', options.pageLifetimes)
      this.lockComponent('hide', options.pageLifetimes)
    },
    proxyBehavior(options) {
      this.lockBehavior('created', options)
      this.lockBehavior('attached', options)
      this.lockBehavior('ready', options)
      this.lockBehavior('created', options.lifetimes)
      this.lockBehavior('attached', options.lifetimes)
      this.lockBehavior('ready', options.lifetimes)
      this.lockBehavior('show', options.pageLifetimes)
      this.lockBehavior('hide', options.pageLifetimes)
    },
    lockPage(name, options) {
      if (!options.onInit) return
      const fn = options[name]
      if (!fn) return
      options[name] = async function () {
        if (this.$$lock) {
          await this.$$lock
        }
        return fn.apply(this, arguments)
      }
    },
    lockComponent(name, options) {
      const fn = options[name]
      if (!fn) return
      options[name] = async function () {
        if (!this.$$locker) {
          this.$$locker = new Promise((reslove) => this.$$unLock = reslove)
        }
        if (name === 'attached') {
          const page = getPage(this)
          if (page) {
            if (!page.$$childLocks) {
              page.$$childLocks = []
            }
            page.$$childLocks.push(this)
            if (page.$$lock) {
              await page.$$lock
              this.$$unLock()
            }
          }
          if (!page || !page.onInit) {
            this.$$unLock()
          }
        }
        await this.$$locker
        return fn.apply(this, arguments)
      }
    },
    lockBehavior(name, options) {
      const fn = options[name]
      if (!fn) return
      options[name] = async function () {
        if (!this.$$locker) {
          this.$$locker = new Promise((reslove) => this.$$behaviorUnLock = reslove)
        }
        await this.$$locker
        return fn.apply(this, arguments)
      }
    }
  }
})
