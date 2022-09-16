/*
* wxbuf.js
* copyRight lingluo 2022
*/

const storageCache = Symbol()
let passback_queue = []
let userWatcherConfig = {}
let userConfig = {
  methodPrefix: ''
}
let appOption = {}
const _components = []
const _App = App
const _Page = Page
const _Component = Component
const _Behavior = Behavior

const isObject = function (a) {
  return Object.prototype.toString.call(a) === '[object Object]'
}

const isNumber = function (a) {
  return Object.prototype.toString.call(a) === '[object Number]'
}

const isFunction = function (a) {
  return Object.prototype.toString.call(a) === "[object Function]"
}

const parsePageOnLoadArgvs = function (option) {
  if (isObject(option)) {
    for (let key in option) {
      if (option.hasOwnProperty(key)) {
        const val = option[key]
        if (val) {
          try {
            const parsedVal = JSON.parse(val)
            // 解析json
            if (isObject(parsedVal)) {
              option[key] = parsedVal
            }
            //解析number
            else if (isNumber(parsedVal) && val === parsedVal.toString()) {
              option[key] = parsedVal
            }
          } catch (e) { }
        }
      }
    }
  }
  return option
}

const pageTapProxy = function (options) {
  if (!userWatcherConfig.onElementTap) {
    return
  }
  const innerHooks = [
    'data',
    'onLoad',
    'onShow',
    'onReady',
    'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onShareAppMessage',
    'onShareTimeline',
    'onPageScroll',
    'onTabItemTap',
    'onResize',
    'onAddToFavorites'
  ]
  for (let key in options) {
    if (
      options.hasOwnProperty(key)
      && !innerHooks.includes(key)
      && isFunction(options[key])
    ) {
      const _originalFunc = options[key]
      options[key] = function (e) {
        const { route } = getCurrentPage()
        if (e && e.type === 'tap' && e.target && e._userTap) {
          userWatcherConfig.onElementTap.call(this, { ...e, path: route })
        }
        return _originalFunc && _originalFunc.apply(this, arguments)
      }
    }
  }
}

const objectToQueryString = function (data) {
  const array = []
  if (isObject(data)) {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let value = data[key]
        if (isObject(value)) {
          value = JSON.stringify(value)
        }
        array.push(`${key}=${value}`)
      }
    }
  }
  return array.join('&')
}

const startTo = function (option, isRedirect = false) {
  if (appOption.beforeRouteEnter) {
    let ret = appOption.beforeRouteEnter(option)
    if (ret === false) {
      return
    }
    option = ret ? ret : option
  }
  let { url, data } = option
  if (!/^\//.test(url)) {
    throw new URIError(`url必须以/开头`)
  }
  const query = objectToQueryString(data)
  url = query ? `${url}?${query}` : url
  if (isRedirect) {
    wx.redirectTo({ url })
  } else {
    wx.navigateTo({ url })
  }
}

const navigateTo = function (option) {
  startTo(option)
  return new Promise((resolve, reject) => {
    passback_queue.unshift({
      finish: resolve,
      url: option.url.split('?')[0].replace(/^\//, '')
    })
    // 小程序最多打开5层页面, 最多只有4层需要等待数据
    if (passback_queue.length > 4) {
      passback_queue = passback_queue.slice(0, 4)
    }
  })
}

const redirectTo = function (option) {
  startTo(option, true)
}

const finish = function (data, path) {
  const feedbackPromiseIndex = passback_queue.findIndex(item => item.url === path)
  if (feedbackPromiseIndex > -1) {
    passback_queue[feedbackPromiseIndex].finish(data)
    passback_queue.splice(feedbackPromiseIndex, 1)
  }
  wx.navigateBack()
}

const fireEvent = function (event, data) {
  getCurrentPages().forEach(page => {
    const { listeners } = page
    if (isObject(listeners)) {
      if (listeners.hasOwnProperty(event) && isFunction(listeners[event])) {
        listeners[event].call(page, event, data)
      }
    }
  })
  _components.forEach(({ comp, option }) => {
    const { listeners } = option
    if (isObject(listeners)) {
      if (listeners.hasOwnProperty(event) && isFunction(listeners[event])) {
        listeners[event].call(comp, event, data)
      }
    }
  })
  if (appOption.listeners && appOption.listeners.hasOwnProperty(event) && isFunction(appOption.listeners[event])) {
    appOption.listeners[event].call(appOption, event, data)
  }
}

const updateStateAndNotify = function (key, value, oldValue, mixinType, lifeCycle) {
  const argvs = [{ [key]: value }, { [key]: oldValue }]
  getCurrentPages().forEach(page => {
    if (page[mixinType] && Array.isArray(page[mixinType])) {
      const obj = {}
      page[mixinType].forEach((_key) => {
        const [sourceKey, targetKey] = getRealKey(_key)
        if (sourceKey === key) {
          obj[targetKey] = value
        }
      })
      page.setData(obj)
    }
    if (page[lifeCycle]) {
      page[lifeCycle](...argvs)
    }
  })
  _components.forEach(({ comp, option }) => {
    if (option[mixinType] && Array.isArray(option[mixinType])) {
      const obj = {}
      option[mixinType].forEach((_key) => {
        const [sourceKey, targetKey] = getRealKey(_key)
        if (sourceKey === key) {
          obj[targetKey] = value
        }
      })
      comp.setData(obj)
    }
    if (option[lifeCycle]) {
      option[lifeCycle].call(comp, ...argvs)
    }
  })
  if (appOption[lifeCycle]) {
    appOption[lifeCycle](...argvs)
  }
}

const setStorageSync = function (key, value) {
  const app = getApp()
  if (app[storageCache] === undefined) {
    app[storageCache] = {}
  }
  const oldValue = app[storageCache][key]
  app[storageCache][key] = value
  wx.setStorageSync(key, value)
  updateStateAndNotify(key, value, oldValue, 'mixinStorage', 'onStorageChange')
}

const removeStorageSync = function (key) {
  const app = getApp()
  const oldValue = app[storageCache]?.[key]
  if (app[storageCache] && app[storageCache].hasOwnProperty(key)) {
    delete app[storageCache][key]
  }
  wx.removeStorageSync(key)
  updateStateAndNotify(key, '', oldValue, 'mixinStorage', 'onStorageChange')
}

const getStorageSync = function (key) {
  const app = getApp()
  if (app[storageCache] === undefined) {
    app[storageCache] = {}
  }
  let value = app[storageCache][key]
  if (app[storageCache].hasOwnProperty(key)) {
    return value
  }
  value = wx.getStorageSync(key)
  app[storageCache][key] = value
  return value
}

const setGlobalData = function (key, value) {
  const app = getApp()
  if (!app.globalData) {
    app.globalData = {}
  }
  const oldValue = app.globalData[key]
  app.globalData[key] = value
  updateStateAndNotify(key, value, oldValue, 'mixinGlobalData', 'onGlobalDataChange')
}

const getGlobalData = function (key) {
  const app = getApp()
  return app.globalData ? (key ? app.globalData[key] : app.globalData) : undefined
}

const getCurrentPage = function () {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage
}

const getRealKey = (key) => {
  const regExp = /->/
  if (regExp.test(key)) {
    const [sourceKey, targetKey] = key.split('->').map(key => Object.prototype.toString.call(key) === "[object String]" ? key.trim() : key)
    key = targetKey ? targetKey : sourceKey
    return [sourceKey, key]
  } else {
    return [key, key]
  }
}

const initMixinData = function (option, instance) {
  if (option.mixinGlobalData && Array.isArray(option.mixinGlobalData)) {
    const obj = {}
    const { globalData } = getApp()
    option.mixinGlobalData.forEach(key => {
      const [sourceKey, targetKey] = getRealKey(key)
      obj[targetKey] = globalData[sourceKey]
    })
    instance.setData(obj)
  }
  if (option.mixinStorage && Array.isArray(option.mixinStorage)) {
    const obj = {}
    option.mixinStorage.forEach((key) => {
      const [sourceKey, targetKey] = getRealKey(key)
      obj[targetKey] = getStorageSync(sourceKey)
    })
    instance.setData(obj)
  }
}

const overwriteMethod = function (option, key, func) {
  const oldMethod = option[key]
  option[key] = function () {
    func.apply(this, arguments)
    if (oldMethod) {
      return oldMethod.apply(this, arguments)
    }
  }
}

const extendCommonMethods = function (option) {
  const { methodPrefix } = userConfig
  option[`${methodPrefix}navigateTo`] = navigateTo
  option[`${methodPrefix}redirectTo`] = redirectTo
  option[`${methodPrefix}getGlobalData`] = getGlobalData
  option[`${methodPrefix}setGlobalData`] = setGlobalData
  option[`${methodPrefix}getStorageSync`] = getStorageSync
  option[`${methodPrefix}setStorageSync`] = setStorageSync
  option[`${methodPrefix}removeStorageSync`] = removeStorageSync
  option[`${methodPrefix}fireEvent`] = fireEvent
}


App = function (option = {}) {
  appOption = option
  const onLaunch = function () {
    if (userWatcherConfig.onAppLaunch) {
      userWatcherConfig.onAppLaunch.apply(this, arguments)
    }
  }
  const onHide = function () {
    if (userWatcherConfig.onAppHide) {
      userWatcherConfig.onAppHide.call(this)
    }
  }
  const onShow = function () {
    if (userWatcherConfig.onAppShow) {
      userWatcherConfig.onAppShow.call(this)
    }
  }
  overwriteMethod(appOption, 'onLaunch', onLaunch)
  overwriteMethod(appOption, 'onHide', onHide)
  overwriteMethod(appOption, 'onShow', onShow)
  extendCommonMethods(appOption)
  return _App(appOption)
}


Page = function (option) {
  pageTapProxy(option)
  const onLoadOption = Symbol()
  const selfPagePath = Symbol()
  const onLoad = function (opt) {
    initMixinData(option, this)
    if (userConfig.parseOnloadArgvs) {
      opt = parsePageOnLoadArgvs(opt)
    }
    const { route } = getCurrentPage()
    this[selfPagePath] = route
    this[onLoadOption] = opt
    if (userWatcherConfig.onPageLoad) {
      userWatcherConfig.onPageLoad.call(this, { option: opt, path: route })
    }
  }
  const onShow = function () {
    const currentPage = getCurrentPage()
    const { route } = currentPage
    if (userWatcherConfig.onPageShow) {
      userWatcherConfig.onPageShow.call(this, { option: this[onLoadOption], path: route })
    }
    if (appOption.onRouteChange) {
      appOption.onRouteChange(currentPage)
    }
  }
  const onPageScroll = function (e) {
    const { scrollTop } = e
    if (scrollTop === 0 && option.onReachTop) {
      option.onReachTop()
    }
  }
  overwriteMethod(option, 'onLoad', onLoad)
  overwriteMethod(option, 'onShow', onShow)
  overwriteMethod(option, 'onPageScroll', onPageScroll)
  option[`${userConfig.methodPrefix}finish`] = function (data) {
    finish(data, this[selfPagePath])
  }
  extendCommonMethods(option)
  return _Page(option)
}


const factory = function (option, constructr) {
  const selfPagePath = Symbol()
  option = option || {}
  option.methods = option.methods || {}
  option.lifetimes = option.lifetimes || {}
  const _created = option.lifetimes.created || option.created
  const _attached = option.lifetimes.attached || option.attached
  const _detached = option.lifetimes.detached || option.detached

  const created = function () {
    _components.push({ comp: this, option, type: constructr === _Component ? 'component' : 'behavior' })
    try {
      initMixinData(option, this)
    } catch (e) { }
    if (_created) {
      return _created.apply(this, arguments)
    }
  }
  const attached = function () {
    this[selfPagePath] = getCurrentPage().route
    initMixinData(option, this)
    if (_attached) {
      return _attached.apply(this, arguments)
    }
  }

  const detached = function () {
    const index = _components.findIndex(c => c.comp === this)
    if (index > -1) {
      _components.splice(index, 1)
    }
    if (_detached) {
      return _detached.apply(this, arguments)
    }
  }

  option.lifetimes.created = created
  option.lifetimes.attached = attached
  option.lifetimes.detached = detached
  option.methods[`${userConfig.methodPrefix}finish`] = function (data) {
    finish(data, this[selfPagePath])
  }
  extendCommonMethods(option.methods)
  return constructr(option)
}

Component = function (option) {
  return factory(option, _Component)
}

Behavior = function (option) {
  return factory(option, _Behavior)
}

/*
*----- hooks -----
*onAppLaunch
*onAppShow
*onAppHide
*onPageLoad
*onPageShow
*onElementTap
*/
function funcWatch(option = {}) {
  userWatcherConfig = { ...userWatcherConfig, ...option }
}
function funcConfig(option = {}) {
  userConfig = { ...userConfig, ...option }
}

export const watch = funcWatch
export const config = funcConfig
export default { watch, config }
