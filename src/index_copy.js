import {
  noop,
  hasOwn,
  extend,
  isArray,
  isEmpty,
  isEvent,
  isObject,
  isNumber,
  isString,
  upperCase,
  deepClone,
  getRealKey,
  isFunction,
  parseOption,
  defProperty,
  isTabBarPage,
  toQueryString,
  queryToObject,
  getConfigJson,
  mergePathQuery,
  getTabBarPages,
  getPageInstance,
  getValueByKeypath,
  getPathWithOutQuery,
  getNavigateBarTitle,
} from './util'
import {
  addCom,
  addPage,
  removeCom,
  removePage,
  getSavedPages,
  getSavedComs,
  getSavedTabBars,
  getSavedAppBars
} from './instance'
import path from './path'
import { builtInHooks } from './builtInHooks'
import { storageCache } from './storageCache'
import { renderViewAsync } from './renderAsync'
import { callUserHook, watchHook } from './hookConfig'
import { saveAppConfig, callAppHook, getAppConfig } from './appConfig'


let userConfig = {
  methodPrefix: '',
  parseUrlArgs: false,
  enableGlobalShareAppMessage: false,
  enableGlobalShareTimeline: false,
  storeKey: 'globalData'
}


const extendFns = {
  page: {},
  component: {}
}


const _App = App
const _Page = Page
const _Component = Component
const _Behavior = Behavior
const _wx = wx



const _page = {
  extend(option) {
    extendFns.page = extend(extendFns.page, option)
  }
}
const _component = {
  extend(option) {
    extendFns.component = extend(extendFns.component, option)
  }
}

const extendUserMethods = function (option, target) {
  const map = extendFns[target]
  for (let key in map) {
    const fn = map[key]
    if (isFunction(fn)) {
      option[key] = fn
    }
  }
}




const fireEvent = function (name, value) {
  const event = {
    route: this.$route,
    value
  }
  const notify = function (context, listeners) {
    if (isObject(listeners) && isFunction(listeners[name])) {
      listeners[name].call(context, event)
    }
  }
  getSavedPages().forEach(page => notify(page, page.listeners))
  getSavedComs().forEach(({ context, option }) => notify(context, option.listeners))
  // notify custom tabbar and appbar [skyline]
  getSavedTabBars().concat(getSavedAppBars()).forEach(bar => notify(bar, bar.$constructorOptions.listeners))
  notify(getApp(), getAppConfig('listeners'))
}

const updateMixinsAsync = function (kvs, oldkvs, name) {
  const mixinName = `mixin${upperCase(name, 0)}`
  const injectName = `inject${upperCase(name, 0)}`

  const updateDataSync = function (context, mixinKeys = []) {
    mixinKeys.forEach((key) => {
      const [sourceKey, targetKey] = getRealKey(key)
      if (hasOwn(kvs, sourceKey)) {
        context.data[targetKey] = kvs[sourceKey]
      }
    })
  }

  const updateAppDataSync = function (context) {
    const mixinConfig = getAppConfig(injectName)
    if (!mixinConfig) return
    const { keys: mixinKeys, namespace } = mixinConfig
    mixinKeys.forEach((key) => {
      const [sourceKey, targetKey] = getRealKey(key)
      if (hasOwn(kvs, sourceKey)) {
        if (namespace) {
          if (!context.data[namespace]) {
            context.data[namespace] = {}
          }
          context.data[namespace][targetKey] = kvs[sourceKey]
        } else {
          context.data[targetKey] = kvs[sourceKey]
        }
      }
    })
  }

  getSavedPages().forEach(page => {
    updateDataSync(page, page[mixinName])
    updateAppDataSync(page)
  })
  getSavedComs().forEach(({ context, option }) => {
    updateDataSync(context, option[mixinName])
    updateAppDataSync(context)
  })
  getSavedTabBars().concat(getSavedAppBars()).forEach(bar => {
    updateDataSync(bar, bar.$constructorOptions[mixinName])
    updateAppDataSync(bar)
  })
  renderViewAsync({ kvs, oldkvs, name })
}


const setStorage = function (option) {
  const { success, key, data } = option
  if (!key) return
  const oldVal = storageCache.get(key)
  option.success = function () {
    storageCache.set(key, data)
    updateMixinsAsync({ [key]: data }, { [key]: oldVal }, 'storage')
    return (success || noop).apply(this, arguments)
  }
  return _setStorage.apply(wx, arguments)
}

const batchSetStorage = function (option) {
  const { kvList, success } = option
  const oldVal = function () {
    const o = {}
    kvList.forEach(({ key }) => o[key] = getStorageSync(key))
    return o
  }()
  option.success = function () {
    const kvs = {}
    kvList.forEach(({ key, value }) => {
      kvs[key] = value
      storageCache.set(key, value)
    })
    updateMixinsAsync(kvs, oldVal, 'storage')
    return (success || noop).apply(this, arguments)
  }
  return _batchSetStorage.apply(wx, arguments)
}

const removeStorage = function (option) {
  const { key, success } = option
  if (!key) return
  const oldVal = storageCache.get(key)
  option.success = function () {
    storageCache.remove(key)
    updateMixinsAsync({ [key]: '' }, { [key]: oldVal })
    return (success || noop).apply(this, arguments)
  }
  return _removeStorage.call(wx, option)
}

const getStorageSync = function (key) {
  return storageCache.get(key)
}

const setStorageSync = function (key, value) {
  if (!key) return
  const oldVal = storageCache.get(key)
  storageCache.set(key, value)
  _setStorageSync.call(wx, key, value)
  updateMixinsAsync({ [key]: value }, { [key]: oldVal }, 'storage')
}

const batchSetStorageSync = function (kvList) {
  const kvs = {}
  const oldKvs = {}
  kvList.forEach(({ key, value }) => {
    kvs[key] = value
    storageCache.set(key, value)
    oldKvs[key] = getStorageSync(key)
  })
  updateMixinsAsync(kvs, oldKvs, 'storage')
  return _batchSetStorageSync.apply(wx, arguments)
}

const removeStorageSync = function (key) {
  if (!key) return
  const oldValue = storageCache.get(key)
  storageCache.remove(key)
  _removeStorageSync.call(wx, key)
  updateMixinsAsync({ [key]: '' }, { [key]: oldValue }, 'storage')
}

const clearStorage = function (option = {}) {
  const success = option.success
  const keys = _wx.getStorageInfoSync().keys
  option.success = function () {
    const kvs = {}
    const oldKvs = {}
    keys.forEach(key => {
      kvs[key] = ''
      storageCache.remove(key)
      oldKvs[key] = getStorageSync(key)
    })
    updateMixinsAsync(kvs, oldKvs, 'storage')
    return (success || noop).apply(wx, arguments)
  }
  return _clearStorage.call(wx, option)
}

const clearStorageSync = function () {
  const kvs = {}
  const oldKvs = {}
  _wx.getStorageInfoSync().keys.forEach(key => {
    kvs[key] = ''
    storageCache.remove(key)
    oldKvs[key] = getStorageSync(key)
  })
  updateMixinsAsync(kvs, oldKvs, 'storage')

  return _clearStorageSync.apply(wx, arguments)
}

const getStore = function (key) {
  const data = getApplication()[userConfig.storeKey]
  return data ? (key ? data[key] : data) : undefined
}

const setStore = function (key, value) {
  const { storeKey } = userConfig
  const app = getApplication()
  if (!app[storeKey]) {
    app[storeKey] = {}
  }
  const oldValue = app[storeKey][key]
  app[storeKey][key] = value
  updateMixinsAsync({ [key]: value }, { [key]: oldValue }, 'store')
}

const getCognates = function () {
  return getSavedComs().map(c => c.context).concat(getSavedTabBars()).concat(getSavedAppBars()).filter(c => c.is === this.is)
}

const getCurrentPage = function () {
  const pages = getCurrentPages()
  return pages.length ? pages[pages.length - 1] : null
}

const initMixinData = function (option, context) {
  const gData = getApp()[userConfig.storeKey];
  ['Store', 'Storage'].forEach(name => {
    const mixinKeys = option[`mixin${name}`]
    if (isArray(mixinKeys)) {
      const data = {}
      mixinKeys.forEach(key => {
        const [sourceKey, targetKey] = getRealKey(key)
        data[targetKey] = name === 'Store' ? gData[sourceKey] : getStorageSync(sourceKey)
      })
      context.setData(data)
    }
  })
}

const initAppMixinData = function (context) {
  const gData = getApp()[userConfig.storeKey];
  ['Store', 'Storage'].forEach(name => {
    const mixinConfig = getAppConfig(`inject${name}`)
    if (!mixinConfig) return
    const mixinKeys = mixinConfig.keys
    const namespace = mixinConfig.namespace
    if (isArray(mixinKeys)) {
      const data = {}
      mixinKeys.forEach(key => {
        const [sourceKey, targetKey] = getRealKey(key)
        data[targetKey] = name === 'Store' ? gData[sourceKey] : getStorageSync(sourceKey)
      })
      if (namespace) {
        const _data = extend({}, context.data[namespace] || {}, data)
        context.setData({ [namespace]: _data })
      } else {
        context.setData(data)
      }
    }
  })
}

const overwriteFn = function (option, key, fn) {
  const oldFn = option[key]
  option[key] = function () {
    fn.apply(this, arguments)
    if (oldFn) {
      return oldFn.apply(this, arguments)
    }
  }
}

const extendCommonMethods = function (option) {
  const { methodPrefix: pref } = userConfig
  option[`${pref}openPage`] = openPage
  option[`${pref}replacePage`] = replacePage
  option[`${pref}getStore`] = getStore
  option[`${pref}setStore`] = setStore
  option[`${pref}getStorageSync`] = getStorageSync
  option[`${pref}setStorageSync`] = setStorageSync
  option[`${pref}removeStorageSync`] = removeStorageSync
  option[`${pref}setStorage`] = setStorage
  option[`${pref}removeStorage`] = removeStorage
  option[`${pref}batchSetStorage`] = batchSetStorage
  option[`${pref}batchSetStorageSync`] = batchSetStorageSync
  option[`${pref}clearStorage`] = clearStorage
  option[`${pref}clearStorageSync`] = clearStorageSync
  option[`${pref}fireEvent`] = fireEvent
}

const createVirtualPage = function (context) {
  const pageId = context.getPageId()
  return new Proxy({}, {
    get(target, key) {
      const page = getCurrentPages().find(p => p.getPageId() === pageId)
      if (page) {
        return isFunction(page[key]) ? page[key].bind(page) : page[key]
      } else {
        console.warn('wxbuf: 访问了不存在的页面实例')
        return undefined
      }
    }
  })
}



const defineReactive = function (option, fn) {
  return new Proxy(option, {
    get(target, key) {
      return target[key]
    },
    set(target, key, value) {
      const oldValue = target[key]
      if (oldValue !== value) {
        fn && fn({ [key]: value }, { [key]: oldValue }, 'store')
      }
      target[key] = value
      return true
    }
  })
}

let _app = null

const fixGetApp = function (app) {
  _app = app
}

defProperty(globalThis, 'getApplication', function () {
  return getApp() || _app
})
defProperty(globalThis, 'getSavedPages', getSavedPages)
defProperty(globalThis, 'getSavedTabBars', getSavedTabBars)
defProperty(globalThis, 'getSavedAppBars', getSavedAppBars)

App = function (option = {}) {
  const { storeKey } = userConfig
  saveAppConfig(option)
  if (!isObject(option[storeKey])) {
    option[storeKey] = {}
  }
  option[storeKey] = defineReactive(option[storeKey], updateMixinsAsync)

  const onLaunch = function (...args) {
    fixGetApp(this)
    callUserHook(this, 'onAppLaunch', ...args)
  }

  const onHide = function () {
    callUserHook(this, 'onAppHide')
  }

  const onShow = function () {
    callUserHook(this, 'onAppShow')
  }

  overwriteFn(option, 'onLaunch', onLaunch)
  overwriteFn(option, 'onHide', onHide)
  overwriteFn(option, 'onShow', onShow)
  extendCommonMethods(option)
  return _App(option)
}


const fnProxy = function (context, key, fn) {
  if (context._ignore) { return }
  const oldFn = context[key] || noop
  context[key] = function () {
    if (fn.apply(this, arguments) === false) {
      return
    }
    return oldFn.apply(this, arguments)
  }
  context._ignore = true
}

const initPageRouter = function (context) {
  const fn = function (option) {
    const absoluteURL = path.resolve(context.is, option.url)
    return callAppHook('beforePageEnter', Object.assign({}, option, { url: absoluteURL }), getConfigJson(getPathWithOutQuery(absoluteURL)))
  }
  fnProxy(context.pageRouter, 'navigateTo', fn)
  fnProxy(context.pageRouter, 'redirectTo', fn)
  fnProxy(context.pageRouter, 'reLaunch', fn)
  fnProxy(context.pageRouter, 'switchTab', fn)
  fnProxy(context.router, 'navigateTo', fn)
  fnProxy(context.router, 'redirectTo', fn)
  fnProxy(context.router, 'reLaunch', fn)
  fnProxy(context.router, 'switchTab', fn)
}



const getPageTabbar = context => {
  if (isFunction(context.getTabBar)) {
    const tabbar = context.getTabBar()
    if (tabbar && isFunction(tabbar.setData)) {
      return tabbar
    }
    return null
  }
  return null
}

const createOnLoad = function (option) {
  return function (params) {
    ///!!!
    addPage(this)
    ///!!!
    initContext(this)
    
    initOpener(this)
    initBody(params, this)
    initSwitchTabParams(params, this)
    initFeature(this)
    initPageRouter(this)
    initMixinData(option, this)
    initAppMixinData(this)
    initComputed(option, this)
    // fix bug: app.json config "lazyCodeLoading": "requiredComponents"
    if (isTabBarPage(this.route)) {
      const tabbar = this.getTabBar()
      if (tabbar) {
        initMixinData(tabbar.$constructorOptions, tabbar)
        initAppMixinData(tabbar)
        initComputed(tabbar.$constructorOptions, tabbar)
      }
    }
    initParentLifetimes(this)
    //!!!
    initObservers(option, this)
    this.$rawParamsQuery = toQueryString(params)
    this.$rawParams = extend({}, params)
    this.$route = this.route
    parseOption(params, !userConfig.parseUrlArgs)
    this.$params = params

    // relation tabbar to page
    const tabbar = getPageTabbar(this)
    if (tabbar) {
      tabbar.$page = this
      tabbar.$feature = this.$feature
      tabbar.$route = this.route
    }

    callUserHook(this, 'onPageLoad', {
      option: params,
      path: this.route
    })
    callAppHook('onPageLoad', this, {
      option: params,
      path: this.route
    })
  }
}

const callTabbarPageLifetime = (pageContext, hookName, argv) => {
  const tabbar = getPageTabbar(pageContext)
  if (
    tabbar &&
    tabbar.$constructorOptions &&
    tabbar.$constructorOptions.pageLifetimes &&
    tabbar.$constructorOptions.pageLifetimes[hookName]
  ) {
    tabbar.$constructorOptions.pageLifetimes[hookName].call(tabbar, argv)
  }
}

const createOnShow = function (option) {
  const fn = option.onShow || noop
  option.onShow = function () {
    processSwitchTab(this)

    callUserHook(this, 'onPageShow', {
      option: this.$params,
      path: this.route
    })
    callAppHook('onPageShow', this)
    // fix bug: tabbar pageLifetime.show not work
    callTabbarPageLifetime(this, 'show')

    const ret = fn.call(this)

    if (this._wakeUp && this.onWakeup) {
      this.onWakeup()
    }

    defProperty(this, '_wakeUp', true)
    return ret
  }
}

const createLifeTime = function (hook, userHook) {
  return function (e) {
    callUserHook(this, userHook, extend({ path: this.route }, e || {}))
    getSavedComs().forEach(({ context, page, option }) => {
      if (page === this && option.pageLifetimes && option.pageLifetimes[hook]) {
        option.pageLifetimes[hook].apply(context, arguments)
      }
    })
    callTabbarPageLifetime(this, hook, e)
  }
}

Page = function (option) {
  //!!!
  initProxyTap(option)
  //!!!
  initShareAppMessage(option)
  //!!!
  initGlobalShareAppMessage(option)
  //!!!
  initShareTimeline(option)
  ///!!!
  initGlobalShareTimeline(option)
  overwriteFn(option, 'onLoad', createOnLoad(option))
  createOnShow(option)
  overwriteFn(option, 'onUnload', function () {
    removePage(this)
    callAppHook('onPageUnload', this)
  })
  overwriteFn(option, 'onPullDownRefresh', createLifeTime('pullDownRefresh', 'onPagePullDownRefresh'))
  overwriteFn(option, 'onReachBottom', createLifeTime('reachBottom', 'onPageReachBottom'))
  overwriteFn(option, 'onPageScroll', createLifeTime('pageScroll', 'onPageScroll'))
  option[`${userConfig.methodPrefix}finish`] = function (data) {
    finish(data, this)
  }
  option[`${userConfig.methodPrefix}invoke`] = function (fnName, ...args) {
    if (this.$opener && isFunction(this.$opener[fnName])) {
      return this.$opener[fnName](...args)
    }
  }
  extendCommonMethods(option)
  extendUserMethods(option, 'page')
  return _Page(option)
}

const installExportMethods = function (option, context) {
  let { exports } = option
  const parent = context.selectOwnerComponent()
  if (exports && parent) {
    if (isFunction(exports)) {
      exports = exports.call(context)
    }
    context.$exports = exports
    const { namespace = null, methods = {} } = exports
    if (namespace && parent[namespace]) return
    let target = parent
    if (namespace) {
      target = parent[namespace] = { $installedBy: context }
    }
    for (let key in methods) {
      const fn = methods[key]
      if (methods.hasOwnProperty(key) && isFunction(fn) && !target[key]) {
        target[key] = fn.bind(context)
        target[key].$installedBy = context
      }
    }
  }
}

const uninstallExportsMethods = function (option, context) {
  const parent = context.selectOwnerComponent()
  const exports = context.$exports
  if (!parent || !exports) return
  const { namespace = null, methods = {} } = exports
  if (namespace) {
    if (parent[namespace] && parent[namespace].$installedBy === context) {
      delete parent[namespace]
    }
  } else {
    for (let key in methods) {
      if (parent[key] && parent[key].$installedBy === context) {
        delete parent[key]
      }
    }
  }
}

const getUrlParams = function () {
  return getPageInstance(this).$params
}

const factory = function (option, constructr) {
  option = option || {}
  option.methods = option.methods || {}
  option.lifetimes = option.lifetimes || {}
  const _created = option.lifetimes.created || option.created || noop
  const _attached = option.lifetimes.attached || option.attached || noop
  const _ready = option.lifetimes.ready || option.ready || noop
  const _detached = option.lifetimes.detached || option.detached || noop

  const created = function () {
    try {
      initContext(this)
      initPageRouter(this)
    } catch (e) { }
    if (constructr === _Component) {
      callAppHook('onComponentCreated', this)
    }
    return _created.apply(this, arguments)
  }
  const attached = function () {
    const isComponent = constructr === _Component
    // save constructor Options to instance
    if (isComponent) {
      this.$constructorOptions = option
    }
    const page = getPageInstance(this)
    // fix: 自定义tabbar无法走detached钩子会内存泄露
    if (page.route) {
      addCom({
        context: this,
        option,
        type: isComponent ? 'component' : 'behavior',
        page
      })
    }
    this.$route = page.route
    this.$feature = page.$feature
    this.$page = page
    initMixinData(option, this)
    initAppMixinData(this)
    // initComputed(option, this)
    if (isComponent) {
      installExportMethods(option, this)
    }
    initComputed(option, this)
    if (isComponent) {
      initParentLifetimes(this)
      callAppHook('onComponentAttached', this)
    }
    return _attached.apply(this, arguments)
  }

  const ready = function () {
    callAppHook('onComponentReady', this)
    return _ready.apply(this, arguments)
  }

  const detached = function () {
    const com = removeCom(this)
    if (com.type === 'component') {
      uninstallExportsMethods(com.option, this)
      const parent = this.selectOwnerComponent()
      if (parent) {
        if (parent.$components) {
          const index = parent.$components.indexOf(this)
          if (index > -1) {
            parent.$components.splice(index, 1)
            this.$parent = null
          }
        }
        if (this.$parentProvides) {
          this.$parentProvides.forEach(parent => {
            const index = parent.$provideWatchers.findIndex(w => w.context === this)
            if (index > -1) {
              parent.$provideWatchers.splice(index, 1)
            }
          })
        }
      }
      callAppHook('onComponentDetached', this)
    }
    return _detached.apply(this, arguments)
  }

  option.lifetimes.created = created
  option.lifetimes.attached = attached
  option.lifetimes.ready = ready
  option.lifetimes.detached = detached
  initProxyTap(option.methods, false)

  option.methods[`${userConfig.methodPrefix}finish`] = function (data) {
    finish(data, this.$page)
  }


  extendCommonMethods(option.methods)

  if (constructr === _Component) {
    extendUserMethods(option.methods, 'component')
    option.methods[`${userConfig.methodPrefix}invoke`] = function (fnName, ...args) {
      if (this.$page.$opener && isFunction(this.$page.$opener[fnName])) {
        this.$page.$opener[fnName](...args)
      }
    }
    option.methods[`${userConfig.methodPrefix}getUrlParams`] = getUrlParams

    option.methods[`${userConfig.methodPrefix}getPageInstance`] = function () {
      return getPageInstance(this)
    }
    option.methods[`${userConfig.methodPrefix}getCognates`] = getCognates
  }

  return constructr(option)
}

Component = function (option) {
  return factory(option, _Component)
}

Behavior = function (option) {
  return factory(option, _Behavior)
}

function _config(option = {}) {
  extend(userConfig, option)
  initWx()
}

const _global = {
  extend(globalVar, value) {
    if (globalVar === 'wx') {
      console.warn('global.extend: 不能重复定义wx')
    } else {
      Object.defineProperty(globalThis, globalVar, {
        get: () => value,
      })
    }
  }
}
const fnsBakup = {
  openPage: wx.openPage,
  replacePage: wx.replacePage,
  getStore: wx.getStore,
  setGlobbalData: wx.setStore,
  finish: wx.finish,
  getNavigateBarTitle: wx.getNavigateBarTitle,
  getTabBarPages: wx.getTabBarPages,
  isTabBarPage: wx.isTabBarPage,
  getConfigJson: wx.getConfigJson,
  fireEvent: wx.fireEvent
}

function initWx() {
  extend(wx, fnsBakup)
  const { methodPrefix: pref } = userConfig
  wx[`${pref}openPage`] = openPage
  wx[`${pref}replacePage`] = replacePage
  wx[`${pref}getStore`] = getStore
  wx[`${pref}setStore`] = setStore
  wx[`${pref}finish`] = function (data) {
    finish(data, getCurrentPage())
  }
  wx[`${pref}getNavigateBarTitle`] = getNavigateBarTitle
  wx[`${pref}getTabBarPages`] = getTabBarPages
  wx[`${pref}isTabBarPage`] = isTabBarPage
  wx[`${pref}getConfigJson`] = getConfigJson
  wx[`${pref}fireEvent`] = fireEvent

  wx.getStorageSync = getStorageSync
  wx.setStorage = setStorage
  wx.setStorageSync = setStorageSync
  wx.removeStorageSync = removeStorageSync
  wx.removeStorage = removeStorage
  wx.batchSetStorage = batchSetStorage
  wx.batchSetStorageSync = batchSetStorageSync
  wx.clearStorage = clearStorage
  wx.clearStorageSync = clearStorageSync
  wx.navigateTo = navigateTo
  wx.redirectTo = redirectTo
  wx.reLaunch = reLaunch
  wx.switchTab = switchTab
}

initWx()
export const watch = watchHook
export const config = _config
export const page = _page
export const component = _component
export const global = _global
const wxbuf = {
  setStorage,
  removeStorage,
  getStorageSync,
  setStorageSync,
  removeStorageSync,
  clearStorage,
  clearStorageSync,
  batchSetStorage,
  batchSetStorageSync,
  setStore,
  getStore,
  reLaunch,
  navigateTo,
  redirectTo,
  switchTab,
  getNavigateBarTitle,
  getTabBarPages,
  isTabBarPage,
  getConfigJson
}

global.extend('wxbuf', wxbuf)

Object.defineProperty(wxbuf, 'version', {
  get: () => '1.0',
  configurable: false,
})

export default {
  page,
  watch,
  config,
  global,
  component
}