/*
 * wxbuf.js
 * version: v1.0
 * update at 2023/11/20
 */
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
  getPathWithOutQuery,
  getNavigateBarTitle,
} from './util'
import { 
  addCom, 
  addPage, 
  removeCom, 
  removePage, 
  pages as _pages,
  components as _components, 
} from './instance'
import path from './path'
import { Watcher } from './hookWatcher'
import { builtInHooks } from './builtInHooks'
import { storageCache } from './storageCache'
import { renderViewAsync } from './renderAsync'

const userWatcher = new Watcher()
let userConfig = {
  methodPrefix: '',
  parseUrlArgs: false,
  enableGlobalSharePage: false,
}

let appOption = {}
const extendFns = {
  page: {},
  component: {}
}


const _App = App
const _Page = Page
const _Component = Component
const _Behavior = Behavior
const _wx = wx
// const _getStorage = wx.getStorage
const _setStorage = wx.setStorage
const _batchSetStorage = wx.batchSetStorage
const _batchSetStorageSync = wx.batchSetStorageSync
const _removeStorage = wx.removeStorage
const _getStorageSync = wx.getStorageSync
const _setStorageSync = wx.setStorageSync
const _removeStorageSync = wx.removeStorageSync
const _clearStorage = wx.clearStorage
const _clearStorageSync = wx.clearStorageSync
const _navigateTo = wx.navigateTo
const _redirectTo = wx.redirectTo
const _reLaunch = wx.reLaunch
const _switchTab = wx.switchTab
wx = Object.assign(Object.create(_wx.__proto__), wx)

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

const callUserHook = function (context, hook, ...args) {
  userWatcher.invoke(hook, context, ...args)
}

const callAppHook = function (hook) {
  if (isFunction(appOption[hook])) {
    return appOption[hook].apply(getApp(), [].slice.call(arguments, 1))
  }
}

const initProxyTap = function (options, isPage = true) {
  for (let key in options) {
    if (
      options.hasOwnProperty(key) &&
      (!isPage || !builtInHooks.includes(key)) &&
      isFunction(options[key])
    ) {
      const fn = options[key]
      options[key] = function (e) {
        if (isEvent(e) && !e._ignore) {
          callUserHook(this, 'on' + upperCase(e.type, 0), extend(e, { path: getPageInstance(this).route }))
        }
        if (fn) {
          if (appOption.onUIEventDispatch && isEvent(e) && !e._ignore) {
            let prevent = true
            let args = [e]
            const next = function () {
              prevent = false
              args = [].slice.call(arguments, 0)
            }
            appOption.onUIEventDispatch.call(getApp(), e, next)
            defProperty(e, '_ignore', true)
            if (!prevent) {
              return fn.apply(this, args)
            }
          } else {
            if (isEvent(e)) {
              defProperty(e, '_ignore', true)
            }
            return fn.apply(this, arguments)
          }
        }
      }
    }
  }
}


const isRouteAllow = function (option) {
  if (!/^\//.test(option.url)) {
    throw new URIError(`url必须以/开头`)
  }
  return callAppHook('beforePageEnter', option, getConfigJson(getPathWithOutQuery(option.url))) ?? true
}

const startPage = function (o, replace = false) {
  const url = mergePathQuery(o.url, o.params)
  if (replace) {
    _redirectTo.call(wx, { url })
  } else {
    _navigateTo.call(wx, { url })
  }
}

const getUrlByName = function (name) {
  const pages = __wxAppCode__ || {}
  let page
  const re = /\.json$/i
  for (let key in pages) {
    page = pages[key]
    if (hasOwn(pages, key) && re.test(key) && page.name === name) {
      return `/${key.replace(re, '')}`
    }
  }
  return null
}

const processUrlByName = function (option) {
  if (option.name && !option.url) {
    const url = getUrlByName(option.name)
    if (!url) {
      throw new Error(`[wxbuf]: 不存在name为'${option.name}'的页面`)
    }
    option.url = url
  }
}

const openPage = function (option) {
  processUrlByName(option)
  if (isRouteAllow(option)) {
    createOpener(option, this)
    const promise = createFeature(option)
    createBody(option)
    startPage(option)
    return promise
  }
  return Promise.reject()
}

const replacePage = function (option) {
  processUrlByName(option)
  if (isRouteAllow(option)) {
    createBody(option)
    startPage(option, true)
  }
}

const finish = function (data, context) {
  if (context.$feature) {
    context.$feature.resolve(data)
    context.$feature = null
  }
  return wx.navigateBack()
}

const jumpPage = function (fn, option) {
  const page = getCurrentPage()
  const absoluteURL = path.resolve(page ? page.route : '/', option.url)
  if (callAppHook('beforePageEnter', Object.assign({}, option, { url: absoluteURL }), getConfigJson(absoluteURL)) === false) {
    return Promise.reject()
  }
  if (fn === _switchTab) {
    createSwitchTabParams(option)
    option.url = option.url.split("?")[0]
  }
  return fn.call(wx, option)
}

const navigateTo = function (option) {
  return jumpPage(_navigateTo, option)
}

const redirectTo = function (option) {
  return jumpPage(_redirectTo, option)
}

const reLaunch = function (option) {
  return jumpPage(_reLaunch, option)
}

const switchTab = function (option) {
  _switchTabParams = null
  return jumpPage(_switchTab, option)
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
  _pages.forEach(page => notify(page, page.listeners))
  _components.forEach(({ context, option }) => notify(context, option.listeners))
  notify(getApp(), appOption.listeners)
}

const updateMixinsAsync = function (kvs, oldkvs, name) {
  const mixinName = `mixin${upperCase(name, 0)}`
  const updateDataSync = function (context, mixinKeys = []) {
    mixinKeys.forEach((key) => {
      const [sourceKey, targetKey] = getRealKey(key)
      if (hasOwn(kvs, sourceKey)) {
        context.data[targetKey] = kvs[sourceKey]
      }
    })
  }
  _pages.forEach(page => updateDataSync(page, page[mixinName]))
  _components.forEach(({ context, option }) => updateDataSync(context, option[mixinName]))
  renderViewAsync({ kvs, oldkvs, name }, callAppHook)
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

const getGlobalData = function (key) {
  const app = getApplication()
  return app.globalData ? (key ? app.globalData[key] : app.globalData) : undefined
}

const setGlobalData = function (key, value) {
  const app = getApplication()
  if (!app.globalData) {
    app.globalData = {}
  }
  const oldValue = app.globalData[key]
  app.globalData[key] = value
  updateMixinsAsync({ [key]: value }, { [key]: oldValue }, 'globalData')
}

const getCurrentPage = function () {
  const pages = getCurrentPages()
  return pages.length ? pages[pages.length - 1] : null
}

const initMixinData = function (option, context) {
  const { globalData } = getApp();
  ['GlobalData', 'Storage'].forEach(name => {
    const mixinKeys = option[`mixin${name}`]
    if (isArray(mixinKeys)) {
      const data = {}
      mixinKeys.forEach(key => {
        const [sourceKey, targetKey] = getRealKey(key)
        data[targetKey] = name === 'GlobalData' ? globalData[sourceKey] : getStorageSync(sourceKey)
      })
      context.setData(data)
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
  option[`${pref}getGlobalData`] = getGlobalData
  option[`${pref}setGlobalData`] = setGlobalData
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

let _opener = null
const createOpener = function (option, context) {
  _opener = {
    success: option.success,
    url: getPathWithOutQuery(option.url),
    page: context === wx || context === getApp() ? getCurrentPage() : getPageInstance(context)
  }
}

const initOpener = function (context) {
  if (_opener && _opener.url === context.route) {
    context.$opener = _opener.page
    if (isFunction(_opener.success)) {
      _opener.success.call(_opener.page, createVirtualPage(context))
    }
    _opener = null
  } else {
    context.$opener = null
  }
}

let _feature = null
const createFeature = function (option) {
  return new Promise((resolve, reject) => {
    _feature = {
      resolve,
      url: getPathWithOutQuery(option.url)
    }
  })
}

const initFeature = function (context) {
  if (_feature && context.route === _feature.url) {
    context.$feature = _feature
    _feature = null
  }
  const onUnload = context.onUnload || noop
  context.onUnload = function () {
    if (context.$feature) {
      context.$feature.resolve()
      context.$feature = null
    }
    return onUnload.apply(context, arguments)
  }
}

const initContext = function (context) {
  context.$setData = context.setData
}

const initObservers = function (option, context) {
  const observers = option.observers || {}
  if (isEmpty(observers)) return
  const setData = context.setData
  context.setData = function (data) {
    const old = extend({}, context.data)
    setData.apply(context, arguments)
    for (let key in data) {
      const fn = observers[key]
      if (data.hasOwnProperty(key) && isFunction(fn)) {
        if (data[key] !== old[key]) {
          fn.call(context, data[key], old[key])
        }
      }
    }
  }
}

const initComputed = function (option, context) {
  const computed = option.computed || {}
  if (isEmpty(computed)) return
  const setData = context.$setData
  context.setData = function () {
    setData.apply(context, arguments)
    const data = {}
    for (let key in computed) {
      const fn = computed[key]
      if (isFunction(fn)) {
        data[key] = fn.call(context)
      }
    }
    if (!isEmpty(data)) {
      setData.call(context, data)
    }
  }
}

const initGlobalSharePage = function (page) {
  if (userConfig.enableGlobalSharePage && !page.onShareAppMessage) {
    page.onShareAppMessage = function () {
      return {
        title: getNavigateBarTitle(),
        url: [this.route, this.$rawParamsQuery].join('?'),
      }
    }
  }
}

const defineReactive = function (option, fn) {
  return new Proxy(option, {
    get(target, key) {
      return target[key]
    },
    set(target, key, value) {
      const oldValue = target[key]
      if (oldValue !== value) {
        fn && fn({ [key]: value }, { [key]: oldValue }, 'globalData')
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

Object.defineProperty(globalThis, 'getApplication', {
  value: function() {
    return getApp() || _app
  }
})

App = function (option = {}) {

  appOption = option
  if (option.globalData) {
    option.globalData = defineReactive(option.globalData, updateMixinsAsync)
  }

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

let _body = null
const createBody = function (option) {
  _body = {
    data: option.body,
    url: getPathWithOutQuery(option.url)
  }
}

const initBody = function (params, context) {
  if (_body && _body.data && _body.url === context.route) {
    extend(params, _body.data)
    _body = null
  }
}

let _switchTabParams = null
const createSwitchTabParams = function (option) {
  const query = option.url.split("?")[1]
  if (query) {
    _switchTabParams = {
      url: getPathWithOutQuery(option.url),
      data: queryToObject(query)
    }
  }
}

const initSwitchTabParams = function (option, context) {
  if (_switchTabParams && isTabBarPage(context.route) && _switchTabParams.url === context.route) {
    extend(option, _switchTabParams.data)
    _switchTabParams = null
  }
}

const createOnLoad = function (option) {
  return function (params) {
    addPage(this)
    initContext(this)
    initOpener(this)
    initBody(params, this)
    initSwitchTabParams(params, this)
    initPageRouter(this)
    initFeature(this)
    initComputed(option, this)
    initMixinData(option, this)
    initObservers(option, this)
    this.$rawParamsQuery = toQueryString(params)
    this.$rawParams = extend({}, params)
    this.$route = this.route
    parseOption(params, !userConfig.parseUrlArgs)
    this.$params = params
    callUserHook(this, 'onPageLoad', {
      option: params,
      path: this.route
    })
    callAppHook('onPageLoad', {
      option: params,
      path: this.route
    })
  }
}


const createOnShow = function (option) {
  const fn = option.onShow || noop
  // const comSwitchTabLifeTimes = createLifeTime('switchTab')
  option.onShow = function () {
    let switchParams = null
    if (_switchTabParams &&
      isTabBarPage(this.route) &&
      _switchTabParams.url === this.route &&
      this._wakeUp
    ) {
      const options = {}
      initSwitchTabParams(options, this)
      extend(this.$params, options)
      this.$rawParamsQuery = toQueryString(this.$params)
      this.$rawParams = extend({}, this.$params)
      parseOption(options, !userConfig.parseUrlArgs)
      parseOption(this.$params, !userConfig.parseUrlArgs)
      switchParams = options
      // comSwitchTabLifeTimes.call(this, switchParams)
    }

    callUserHook(this, 'onPageShow', {
      option: this.$params,
      path: this.route
    })
    callAppHook('onPageChange', this)
    // const params = this._wakeUp ? (switchParams || {}) : this.$params
    const ret = fn.call(this/**, params **/)
    if (this._wakeUp && this.onWakeup) {
      this.onWakeup(switchParams || {})
    }
    defProperty(this, '_wakeUp', true)
    return ret
  }
}

const createLifeTime = function (hook, userHook) {
  return function (e) {
    callUserHook(this, userHook, extend({ path: this.route }, e || {}))
    _components.forEach(({ context, page, option }) => {
      if (page === this && option.pageLifetimes && option.pageLifetimes[hook]) {
        option.pageLifetimes[hook].apply(context, arguments)
      }
    })
  }
}

Page = function (option) {
  initProxyTap(option)
  initGlobalSharePage(option)
  overwriteFn(option, 'onLoad', createOnLoad(option))
  createOnShow(option)
  overwriteFn(option, 'onUnload', function () { removePage(this) })
  overwriteFn(option, 'onPullDownRefresh', createLifeTime('pullDownRefresh', 'onPagePullDownRefresh'))
  overwriteFn(option, 'onReachBottom', createLifeTime('reachBottom', 'onPageReachBottom'))
  overwriteFn(option, 'onPageScroll', createLifeTime('pageScroll', 'onPageScroll'))
  option[`${userConfig.methodPrefix}finish`] = function (data) {
    finish(data, this)
  }
  extendCommonMethods(option)
  extendUserMethods(option, 'page')
  return _Page(option)
}

const installPageMethods = function (option, context) {
  const { pageMethods } = option
  if (pageMethods) {
    const page = getPageInstance(context)
    for (let key in pageMethods) {
      const fn = pageMethods[key]
      if (pageMethods.hasOwnProperty(key) && isFunction(fn) && !page[key]) {
        page[key] = fn.bind(context)
        page[key].$installedBy = context
      }
    }
  }
}

const uninstallPageMethods = function (option, context) {
  const { pageMethods } = option
  if (pageMethods) {
    const page = getPageInstance(context)
    for (let key in pageMethods) {
      if (page[key] && page[key].$installedBy === context) {
        delete page[key]
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
  const _created = option.lifetimes.created || option.created
  const _attached = option.lifetimes.attached || option.attached
  const _detached = option.lifetimes.detached || option.detached

  const created = function () {
    try {
      initContext(this)
      initComputed(option, this)
      initMixinData(option, this)
      initPageRouter(this)
    } catch (e) { }
    if (_created) {
      return _created.apply(this, arguments)
    }
  }
  const attached = function () {
    const isComponent = constructr === _Component
    const page = getPageInstance(this)
    addCom({
      context: this,
      option,
      type: isComponent ? 'component' : 'behavior',
      page
    })
    this.$route = page.route
    this.$feature = page.$feature
    this.$page = page
    initMixinData(option, this)
    if (isComponent) {
      installPageMethods(option, this)
    }
    if (_attached) {
      return _attached.apply(this, arguments)
    }
  }

  const detached = function () {
    const com = removeCom(this)
    if (com.type === 'component') {
      uninstallPageMethods(com.option, this)
    }
    if (_detached) {
      return _detached.apply(this, arguments)
    }
  }

  option.lifetimes.created = created
  option.lifetimes.attached = attached
  option.lifetimes.detached = detached
  initProxyTap(option.methods, false)

  option.methods[`${userConfig.methodPrefix}finish`] = function (data) {
    finish(data, this.$page)
  }
  option.methods[`${userConfig.methodPrefix}getUrlParams`] = getUrlParams
  option.methods[`${userConfig.methodPrefix}getPage`] = function () {
    return getPageInstance(this)
  }

  extendCommonMethods(option.methods)

  if (constructr === _Component) {
    extendUserMethods(option.methods, 'component')
  }

  return constructr(option)
}

Component = function (option) {
  return factory(option, _Component)
}

Behavior = function (option) {
  return factory(option, _Behavior)
}

function _watch(option = {}) {
  userWatcher.add(option)
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
        get: () => value
      })
    }
  }
}
const fnsBakup = {
  openPage: wx.openPage,
  replacePage: wx.replacePage,
  getGlobalData: wx.getGlobalData,
  setGlobbalData: wx.setGlobalData,
  finish: wx.finish,
}

function initWx() {
  extend(wx, fnsBakup)
  const { methodPrefix: pref } = userConfig
  wx[`${pref}openPage`] = openPage
  wx[`${pref}replacePage`] = replacePage
  wx[`${pref}getGlobalData`] = getGlobalData
  wx[`${pref}setGlobalData`] = setGlobalData
  wx[`${pref}finish`] = function (data) {
    finish(data, getCurrentPage())
  }
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
export const watch = _watch
export const config = _config
export const page = _page
export const component = _component
export const global = _global
const wxbuf = {
  page,
  watch,
  config,
  global,
  component,
  setStorage,
  removeStorage,
  getStorageSync,
  setStorageSync,
  removeStorageSync,
  clearStorage,
  clearStorageSync,
  batchSetStorage,
  batchSetStorageSync,
  setGlobalData,
  getGlobalData,
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
  get() { return '1.0' },
  configurable: false,
  enumerable: false,
})
export default wxbuf