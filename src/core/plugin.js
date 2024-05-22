import {
  COM_LIFETIMES,
  APP_LIFETIMES,
  PAGE_LIFETIMES,
  COM_PAGE_LIFETIMES
} from './constants'


const _Page = Page
const _App = App
const _Component = Component
const _Behavior = Behavior


const noop = function () { }

const installedPlugins = []

export const usePlugin = function (plugin) {
  if (installedPlugins.indexOf(plugin) === -1) {
    installedPlugins.push(plugin)
  }
}

export const getPlugins = function () {
  return installedPlugins
}

const callInitPlugins = function (lifetime, options) {
  installedPlugins.forEach((plugin) => {
    if (plugin.lifetimes[lifetime]) {
      plugin.lifetimes[lifetime].call(plugin, options)
    }
  })
}

export const callPlugins = function (
  context,
  name,
  args,
  ...restArgs
) {
  installedPlugins.forEach((plugin) => {
    plugin.$target = context;
    (plugin.lifetimes[name] || noop).apply(plugin, args.concat(restArgs))
  })
}

const overwrite = function (target, name, options) {
  const fn = options[name] || noop
  options[name] = function (...args) {
    callPlugins(this, `${target}_${name}`, args)
    const res = fn.apply(this, arguments)
    callPlugins(this, `${target}_${name}_end`, args, res)
    return res
  }
}


const patch = function (options) {
  if (!options) options = {}
  if (!options.lifetimes) options.lifetimes = {}
  if (!options.methods) options.methods = {}
  if (!options.pageLifetimes) options.pageLifetimes = {};
  ['created', 'attached', 'ready', 'moved', 'detached', 'error'].forEach(
    name => {
      if (options[name] && !options.lifetimes[name]) {
        options.lifetimes[name] = options[name]
      }
    }
  )
}

App = function (options) {
  callInitPlugins('app_init', options)
  APP_LIFETIMES.forEach(name => overwrite('app', name, options))
  callInitPlugins('app_init_end', options)
  return _App(options)
}

Page = function (options) {
  callInitPlugins('page_init', options)
  PAGE_LIFETIMES.forEach(name => {
    if (!['onShareAppMessage', 'onShareTimeline', 'onAddToFavorites'].includes(name) || options[name]) {
      overwrite('page', name, options)
    }
  })
  callInitPlugins('page_init_end', options)
  return _Page(options)
}

Component = function (options) {
  patch(options)
  callInitPlugins('component_init', options)
  COM_LIFETIMES.forEach(name => {
    overwrite('component', name, options)
    overwrite('component', name, options.lifetimes)
  })
  COM_PAGE_LIFETIMES.forEach(name => overwrite('component', name, options.pageLifetimes))
  callInitPlugins('component_init_end', options)
  return _Component(options)
}

Behavior = function (options) {
  patch(options)
  callInitPlugins('behavior_init', options)
  COM_LIFETIMES.forEach(name => {
    overwrite('behavior', name, options)
    overwrite('behavior', name, options.lifetimes)
  })
  COM_PAGE_LIFETIMES.forEach(name => overwrite('behavior', name, options.pageLifetimes))
  callInitPlugins('behavior_init_end', options)
  return _Behavior(options)
}
