import { getPageInstance, noop } from "./util"


// lifetimes: {
//   created() {
//     this.enable = this.getConfig('pageOnInit') ?? true
//   }
// },

const page_init_end = function (options) {
  proxyOnInit(options)
  proxyOnLoad(options)
  proxyPage(options)
}
const component_init_end = function (options) {
  proxyComponent(options)
}
const behavior_init_end = function (options) {
  proxyBehavior(options)
}

const proxyOnInit = function (options) {
  const app = getApp()
  if (!app.onPageInit)
    return
  const onInit = options.onInit || noop
  options.onInit = async function (...args) {
    await app.onPageInit.call(app, this, ...args)
    return onInit.apply(this, arguments)
  }
}
const proxyOnLoad = function (options) {
  const onLoad = options.onLoad || noop
  options.onLoad = async function () {
    if (!this.$$lock && options.onInit) {
      this.$$lock = options.onInit.apply(this, arguments)
      this.$$isLocked = true
    }
    if (this.$$lock) {
      await this.$$lock
      this.$$isLocked = false
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
    // make sure component's lifetimes is called before page's onLoad
    await Promise.resolve()
    return onLoad.apply(this, arguments)
  }
}

const proxyPage = function (options) {
  lockPage('onShow', options)
  lockPage('onReady', options)
  lockPage('onHide', options)
  lockPage('onUnload', options)
  lockPage('onPullDownRefresh', options)
  lockPage('onReachBottom', options)
  lockPage('onPageScroll', options)
}
const proxyComponent = function (options) {
  if (!options) return
  lockComponent('created', options)
  lockComponent('attached', options)
  lockComponent('ready', options)
  if (!options.lifetimes) return
  lockComponent('created', options.lifetimes)
  lockComponent('attached', options.lifetimes)
  lockComponent('ready', options.lifetimes)
  lockComponent('show', options.pageLifetimes)
  lockComponent('hide', options.pageLifetimes)
}
const proxyBehavior = function (options) {
  if (!options) return
  lockBehavior('created', options)
  lockBehavior('attached', options)
  lockBehavior('ready', options)
  if (!options.lifetimes) return
  lockBehavior('created', options.lifetimes)
  lockBehavior('attached', options.lifetimes)
  lockBehavior('ready', options.lifetimes)
  lockBehavior('show', options.pageLifetimes)
  lockBehavior('hide', options.pageLifetimes)
}
const lockPage = function (name, options) {
  if (!options.onInit) return
  const fn = options[name]
  if (!fn) return
  if ([
    'onPullDownRefresh',
    'onReachBottom',
    'onPageScroll'
  ].includes(name)) {
    options[name] = function () {
      if (this.$$isLocked)
        return
      return fn.apply(this, arguments)
    }
  } else {
    options[name] = async function () {
      if (this.$$lock) {
        await this.$$lock
        await Promise.resolve()
      }
      return fn.apply(this, arguments)
    }
  }
}
const lockComponent = function (name, options) {
  if (!options) return
  const fn = options[name]
  if (!fn) return
  options[name] = async function () {
    if (!this.$$locker) {
      this.$$locker = new Promise((reslove) => this.$$unLock = reslove)
    }
    if (name === 'attached') {
      const page = getPageInstance(this)
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
}
const lockBehavior = function (name, options) {
  if (!options) return
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

export const initPageOnInit = function (options, target) {
  if (target === 'page') {
    page_init_end(options)
  }
  if (target === 'component') {
    component_init_end(options)
  }
  if (target === 'behavior') {
    behavior_init_end(options)
  }
}

