export const isObject = function (a) {
  return Object.prototype.toString.call(a) === '[object Object]'
}

export const isNumber = function (a) {
  return Object.prototype.toString.call(a) === '[object Number]'
}

export const isFunction = function (a) {
  return Object.prototype.toString.call(a) === "[object Function]"
}

export const isString = function (a) {
  return Object.prototype.toString.call(a) === "[object String]"
}

export const hasOwn = function (o, k) {
  return o.hasOwnProperty(k)
}

export const isArray = function (o) {
  return Array.isArray(o)
}

export const isEmpty = function (o) {
  if (isObject(o)) {
    return !Object.keys(o).length
  }
  if (isArray(o)) {
    return !o.length
  }
  if (isString(o)) {
    return o.trim()
  }
  if (o === null || o === undefined) {
    return true
  }
  return false
}
export const extend = function (target, ...source) {
  return Object.assign(target, ...source)
}
export const upperCase = function (str, index) {
  str = str.split('')
  str[index] = str[index].toUpperCase()
  return str.join('')
}

export const getPathWithOutQuery = function (url, base = '') {
  return base + url.split('?')[0].replace(/^\/+/, '')
}

export const noop = function () { }

export const isEvent = function (e) {
  return e && isObject(e) && e.target && e.timeStamp && e.currentTarget && e.type
}

export const getPageInstance = function (context) {
  let p, page
  p = page = context.selectOwnerComponent()
  if (page === null) {
    return context
  }
  while (p = page.selectOwnerComponent()) {
    page = p
  }
  return page
}

export const toQueryString = function (data) {
  if (!isObject(data)) {
    return ''
  }
  const ret = []
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let value = data[key]
      if (isObject(value) || isArray(value)) {
        value = JSON.stringify(value)
      }
      ret.push(`${key}=${value}`)
    }
  }
  return ret.join('&')
}
export const queryToObject = function (str = '') {
  const data = {}
  const params = str.split('&')
  if (params.length) {
    params.forEach(param => {
      const [k, v] = param.split('=')
      data[k] = v
    })
  }
  return data
}

export const mergePathQuery = function (url, params) {
  params = isObject(params) ? toQueryString(params) : params
  return params ? [url, params].join(url.includes('?') ? '&' : '?') : url
}

export const parseOption = function (option, ignore = false) {
  if (!isObject(option) || ignore) {
    return option
  }
  for (let key in option) {
    const val = option[key]
    if (hasOwn(option, key) && val) {
      try {
        const parsedVal = JSON.parse(val)
        if (isObject(parsedVal) || isArray(parsedVal) || parsedVal === null) {
          option[key] = parsedVal
        } else if (isNumber(parsedVal) && val === parsedVal.toString()) {
          option[key] = parsedVal
        }
      } catch (e) { }
      if (val === 'undefined') {
        option[key] = undefined
      }
      else if (val === 'true') {
        option[key] = true
      }
      else if (val === 'false') {
        option[key] = false
      }
    }
  }
  return option
}


export const getTabBarPages = function () {
  if (__wxConfig && __wxConfig.tabBar && __wxConfig.tabBar.list) {
    return __wxConfig.tabBar.list.map(item => item.pagePath.replace(/\.html$/, ''))
  }
  return []
}

export const isTabBarPage = function (path) {
  return getTabBarPages().includes(getPathWithOutQuery(path))
}

// const navigationBarTitleMap = {}
// const setNavigationBarTitle = wx.setNavigationBarTitle
// wx = Object.assign(Object.create(wx.__proto__), wx)

// wx.setNavigationBarTitle = function (options) {
//   const page = getCurrentPages().slice(0).pop()
//   if (page) {
//     navigationBarTitleMap[page.route] = options.title
//   }
//   return setNavigationBarTitle.call(wx, options)
// }

export const getNavigateBarTitle = function () {
  const page = getCurrentPages().slice(0).pop()
  // if(page && hasOwn(navigationBarTitleMap, page.route)) {
  //   return navigationBarTitleMap[page.route]
  // }
  if (page && __wxConfig && __wxConfig.page && __wxConfig.page[page.route + '.html']) {
    return __wxConfig.page[page.route + '.html'].window.navigationBarTitleText
  }
  return ''
}

export const getConfigJson = function (path) {
  return __wxAppCode__ ? (__wxAppCode__[path.replace(/^\//, '') + '.json'] || {}) : {}
}

export const getRealKey = (key) => {
  if (/->/.test(key)) {
    const [sourceKey, targetKey] = key.split('->').map(key => isString(key) ? key.trim() : key)
    key = targetKey ? targetKey : sourceKey
    return [sourceKey, key]
  }
  return [key, key]
}

export const defProperty = function (target, k, v) {
  if (!hasOwn(target, k)) {
    Object.defineProperty(target, k, {
      get: () => v
    })
  }
}

export const getValueByKeypath = (data, keypath) => {
  const keys = keypath.split(/\[|\]|\./).filter(Boolean).map(i => i.replace(/\'|\"/g, ''))
  let val = undefined
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    try {
      data = val = data[key]
    } catch (e) {
      return undefined
    }
  }
  return val
}

const type = arg => {
  return Object.prototype.toString
    .call(arg)
    .replace(/(^\[\w+\s+)|(\]$)/g, '')
    .toLowerCase()
}

export const deepClone = (data) => {
  const targetStack = []
  const sourceStack = []

  const clone = (data) => {
    const typeName = type(data)
    let ret
    if (['array', 'object'].indexOf(typeName) > -1) {
      const index = sourceStack.indexOf(data)
      if (index > -1) {
        return targetStack[index]
      }
      ret = typeName === 'array' ? [] : {}
      targetStack.push(ret)
      sourceStack.push(data)
    }

    if (typeName === 'array') {
      data.forEach((item) => {
        ret.push(clone(item))
      })
    } else if (typeName === 'object') {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          ret[key] = clone(data[key])
        }
      }
    } else {
      return data
    }
    return ret
  }
  return clone(data)
}
