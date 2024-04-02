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
          if (getAppConfig('onEventDispatch') && isEvent(e) && !e._ignore) {
            let prevent = true
            let args = [e]
            const next = function () {
              prevent = false
              args = [].slice.call(arguments, 0)
            }
            callAppHook('onEventDispatch', e, next)
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

const getCognateComponents = function () {
  return getSavedComs().concat(getSavedTabBars()).concat(getSavedAppBars()).filter(c => c.is === this.is)
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
  context.setData = function () {
    // const old = deepClone(this.data)
    const old = {}
    for (let key in observers) {
      old[key] = getValueByKeypath(this.data, key)
    }
    setData.apply(this, arguments)
    for (let key in observers) {
      const fn = observers[key]
      const newVal = getValueByKeypath(this.data, key)
      const oldVal = old[key]
      // const oldVal = getValueByKeypath(old, key)
      if (isFunction(fn) && newVal !== oldVal) {
        fn.call(this, newVal, oldVal)
      }
    }
  }
}

const initComputed = function (option, context) {
  const computed = option.computed || {}
  if (isEmpty(computed)) return
  const setData = context.$setData
  const update = function (computed, context) {
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
  context.setData = function () {
    setData.apply(context, arguments)
    update(computed, context)
  }
  update(computed, context)
}

const initGlobalShareAppMessage = function (page) {
  if (userConfig.enableGlobalShareAppMessage && !page.onShareAppMessage) {
    page.onShareAppMessage = function (object) {
      let options = {
        title: getNavigateBarTitle(),
        url: `${this.route}${this.$rawParamsQuery ? `?${this.$rawParamsQuery}` : ''}`,
      }
      if (getAppConfig('onPageShareAppMessage')) {
        const ret = callAppHook('onPageShareAppMessage', this, options, object)
        if (isObject(ret)) {
          options = ret
        }
      }
      return options
    }
  }
}

const initShareAppMessage = function (page) {
  const cb = page.onShareAppMessage
  if (cb) {
    page.onShareAppMessage = function (object) {
      let options = cb.call(this, object)
      if (getAppConfig('onPageShareAppMessage')) {
        const ret = callAppHook('onPageShareAppMessage', this, options, object)
        if (isObject(ret)) {
          options = ret
        }
      }
      return options
    }
  }
}

const initGlobalShareTimeline = function (page) {
  if (userConfig.enableGlobalShareTimeline && !page.onShareTimeline) {
    page.onShareTimeline = function () {
      let options = {
        title: getNavigateBarTitle(),
        query: this.$rawParamsQuery,
      }
      if (getAppConfig('onPageShareTimeline')) {
        const ret = callAppHook('onPageShareTimeline', this, options)
        if (isObject(ret)) {
          options = ret
        }
      }
      return options
    }
  }
}

const initShareTimeline = function (page) {
  const cb = page.onShareTimeline
  if (cb) {
    page.onShareTimeline = function () {
      let options = cb.call(this)
      if (getAppConfig('onPageShareTimeline')) {
        const ret = callAppHook('onPageShareTimeline', this, options)
        if (isObject(ret)) {
          options = ret
        }
      }
      return options
    }
  }
}

const getParentProvides = function (context) {
  const ret = []
  let parent = context
  let provide = null
  let isStatic
  while ((parent = parent.$parent)) {
    provide = parent.provide
    isStatic = true
    if (provide) {
      if (isFunction(provide)) {
        isStatic = false
        provide = parent.provide()
      }
      if (isObject(provide)) {
        ret.push({ parent, provide, isStatic })
      }
    }
  }
  return ret
}

class ProvideWatcher {

  constructor(parent, context, key) {
    this.parent = parent
    this.context = context
    this.key = key
  }
  update() {
    const provide = this.parent.provide()
    const key = this.key
    const v = provide[key]
    if (isFunction(v)) {
      this.context[key] = v.bind(this.parent)
    } else {
      this.context.setData({ [key]: v })
    }
  }
}


const initInject = function (option, context) {
  const inject = option.inject
  if (option.provide) {
    context.provide = option.provide
  }
  if (isArray(inject) && inject.length) {
    const provides = getParentProvides(context)
    inject.forEach(key => {
      for (let i = 0; i < provides.length; i++) {
        const { parent, provide, isStatic } = provides[i]
        if (hasOwn(provide, key)) {
          if (!isStatic) {
            if (!parent.$provideWatchers) {
              parent.$provideWatchers = []
              const _setData = parent.setData
              parent.setData = function () {
                const ret = _setData.apply(this, arguments)
                this.$provideWatchers.forEach(c => c.update())
                return ret
              }
            }
            parent.$provideWatchers.push(new ProvideWatcher(parent, context, key))

            if (!context.$parentProvides) {
              context.$parentProvides = []
            }
            if (!context.$parentProvides.includes(parent)) {
              context.$parentProvides.push(parent)
            }
          }
          const v = provide[key]
          if (isFunction(v)) {
            context[key] = v.bind(parent)
          } else {
            context.setData({ [key]: v })
          }
          break
        }
      }
    })
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



const processSwitchTab = function (context) {
  let switchParams = null
  const isTabbar = isTabBarPage(context.route)
  if (_switchTabParams &&
    isTabbar &&
    _switchTabParams.url === context.route &&
    context._wakeUp
  ) {
    const options = {}
    initSwitchTabParams(options, context)
    extend(context.$params, options)
    context.$rawParamsQuery = toQueryString(context.$params)
    context.$rawParams = extend({}, context.$params)
    parseOption(options, !userConfig.parseUrlArgs)
    parseOption(context.$params, !userConfig.parseUrlArgs)
    switchParams = options
  }
  if (isTabbar && context._wakeUp) {
    if (context.onSwitchTab) {
      context.onSwitchTab(switchParams || {})
    }
    createLifeTime('switchTab').call(context, switchParams || {})
  }
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
    addPage(this)
    initContext(this)
    initOpener(this)
    initBody(params, this)
    initSwitchTabParams(params, this)
    initPageRouter(this)
    initFeature(this)
    initMixinData(option, this)
    initAppMixinData(this)
    initComputed(option, this)
    // fix bug: app.json config "lazyCodeLoading": "requiredComponents"
    if(isTabBarPage(this.route)) {
      const tabbar = this.getTabBar()
      if(tabbar) {
        initMixinData(tabbar.$constructorOptions, tabbar)
        initAppMixinData(tabbar)
        initComputed(tabbar.$constructorOptions, tabbar)
      }
    }
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
  initProxyTap(option)
  initShareAppMessage(option)
  initGlobalShareAppMessage(option)
  initShareTimeline(option)
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
      const parent = this.selectOwnerComponent()
      if (parent) {
        if (!parent.$components) {
          parent.$components = []
        }
        parent.$components.push(this)
        this.$parent = parent
        initInject(option, this)
      }
    }
    initComputed(option, this)
    if (isComponent) {
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
    option.methods[`${userConfig.methodPrefix}getCognateComponents`] = getCognateComponents
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