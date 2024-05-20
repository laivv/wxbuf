
let body = null
let feature = null
let opener = null

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
    _redirectTo.call(wx, { url })
  } else {
    _navigateTo.call(wx, { url })
  }
}
