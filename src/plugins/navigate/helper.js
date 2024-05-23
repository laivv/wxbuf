import _wx from './_wx'
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
  getCurrentPage,
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
} from '../../util'
import path from '../../path'

let body = null
let feature = null
let opener = null
let switchTabParams = null


export const createBody = function (option) {
  body = {
    data: option.body,
    url: getPathWithOutQuery(option.url)
  }
}

export const resolveBody = function (params, context) {
  if (body && body.data && body.url === context.route) {
    extend(params, body.data)
    body = null
  }
}

export const createFeature = function (option) {
  return new Promise((resolve, reject) => {
    feature = {
      resolve,
      url: getPathWithOutQuery(option.url)
    }
  })
}

export const resolveFeature = function (context) {
  if (feature && context.route === feature.url) {
    context.$feature = feature
    feature = null
  }
}

export const destoryFeature = function (context) {
  if (context.$feature) {
    context.$feature.resolve()
    context.$feature = null
  }
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


export const createOpener = function (option, context) {
  opener = {
    success: option.success,
    url: getPathWithOutQuery(option.url),
    page: context === wx || context === getApp() ? getCurrentPage() : getPageInstance(context)
  }
}

export const resolveOpener = function (context) {
  if (opener && opener.url === context.route) {
    context.$opener = opener.page
    if (isFunction(opener.success)) {
      opener.success.call(opener.page, createVirtualPage(context))
    }
    opener = null
  } else {
    context.$opener = null
  }
}


export const createSwitchTabParams = function (option) {
  const query = option.url.split("?")[1]
  if (query) {
    switchTabParams = {
      url: getPathWithOutQuery(option.url),
      data: queryToObject(query)
    }
  }
}

export const resolveSwitchTabParams_onLoad = function (option, context) {
  if (switchTabParams && isTabBarPage(context.route) && switchTabParams.url === context.route) {
    extend(option, switchTabParams.data)
    switchTabParams = null
  }
}

export const resetSwitchTabParams = function () {
  switchTabParams = null
}


export const resolveSwitchTabParams_onShow = function (context, parseUrlArgs) {
  let switchParams = null
  const isTabbar = isTabBarPage(context.route)
  if (switchTabParams &&
    isTabbar &&
    switchTabParams.url === context.route &&
    context._wakeUp
  ) {
    const options = {}
    resolveSwitchTabParams_onLoad(options, context)
    extend(context.$params, options)
    context.$rawParamsQuery = toQueryString(context.$params)
    context.$rawParams = extend({}, context.$params)
    parseOption(options, !parseUrlArgs)
    parseOption(context.$params, !parseUrlArgs)
    switchParams = options
  }
  if (isTabbar && context._wakeUp) {
    if (context.onSwitchTab) {
      context.onSwitchTab(switchParams || {})
    }
    // createLifeTime('switchTab').call(context, switchParams || {})
  }
}


export const isRouteAllow = function (option) {
  if (!/^\//.test(option.url)) {
    throw new Error(`url必须以/开头`)
  }
  const app = getApp()
  let isAllow
  if (app.beforePageEnter) {
    isAllow = app.beforePageEnter(option, getConfigJson(getPathWithOutQuery(option.url)))
  }
  return isAllow ?? true
}


export const startPage = function (o, replace = false) {
  const url = mergePathQuery(o.url, o.params)
  if (replace) {
    _wx.redirectTo.call(wx, { url })
  } else {
    _wx.navigateTo.call(wx, { url })
  }
}

export const jumpPage = function (fn, option) {
  const page = getCurrentPage()
  const absoluteURL = path.resolve(page ? page.route : '/', option.url)
  const app = getApp()
  if (app.beforePageEnter && app.beforePageEnter(Object.assign({}, option, { url: absoluteURL }), getConfigJson(absoluteURL)) === false) {
    return Promise.reject()
  }
  if (fn === _wx.switchTab) {
    createSwitchTabParams(option)
    option.url = option.url.split("?")[0]
  }
  return fn.call(wx, option)
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


export const resolvePageRouter = function (context) {
  const fn = function (option) {
    const absoluteURL = path.resolve(context.is, option.url)
    const app = getApp()
    let allow = true
    if (app.beforePageEnter) {
      allow = app.beforePageEnter(Object.assign({}, option, { url: absoluteURL }), getConfigJson(getPathWithOutQuery(absoluteURL)))
    }
    return allow ?? true
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