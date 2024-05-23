






const getCognates = function () {
  return getSavedComs().map(c => c.context).concat(getSavedTabBars()).concat(getSavedAppBars()).filter(c => c.is === this.is)
}

const getCurrentPage = function () {
  const pages = getCurrentPages()
  return pages.length ? pages[pages.length - 1] : null
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
  }
  extendCommonMethods(option)
  return _App(option)
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

