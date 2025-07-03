

let onLaunchPromise = null
let onLaunch = null


const app_init_end = function (options) {
  proxyOnLaunch(options)
  proxyHook(options, 'onShow')
  proxyHook(options, 'onHide')
  proxyHook(options, 'onError')
  proxyHook(options, 'onPageNotFound')
  proxyHook(options, 'onUnhandledRejection')
  proxyHook(options, 'onThemeChange')
}

const page_init_end = function (options) {
  proxyHook(options, 'onLoad')
  proxyHook(options, 'onShow')
  proxyHook(options, 'onReady')
  proxyHook(options, 'onHide')
  proxyHook(options, 'onUnload')
  proxyHook(options, 'onRouteDone')
  proxyHook(options, 'onPullDownRefresh')
  proxyHook(options, 'onReachBottom')
  proxyHook(options, 'onPageScroll')
  proxyHook(options, 'onResize')
  proxyHook(options, 'onTabItemTap')
}

const component_init_end = function (options) {
  proxyHook(options, 'created')
  proxyHook(options, 'attached')
  proxyHook(options, 'ready')
  proxyHook(options, 'moved')
  proxyHook(options, 'detached')
  proxyHook(options.lifetimes, 'created')
  proxyHook(options.lifetimes, 'attached')
  proxyHook(options.lifetimes, 'ready')
  proxyHook(options.lifetimes, 'moved')
  proxyHook(options.lifetimes, 'detached')
}


const proxyOnLaunch = function (options) {
  if (!options.onLaunch) return
  onLaunch = options.onLaunch
  options.onLaunch = function () {
    const res = onLaunch.apply(this, arguments)
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
}

const proxyHook = function (option, key) {
  const fn = option[key]
  if (!onLaunch || !fn) return
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

export const initAsyncOnLaunch = function (option, target) {
  if (target === 'app') {
    app_init_end(option)
  }
  if (target === 'page') {
    page_init_end(option)
  }
  if (target === 'component' || target === 'behavior') {
    component_init_end(option)
  }
}