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

const installedPlugins = {
  app: [],
  page: [],
  component: [],
  behavior: []
}

export const usePlugin = function (plugin) {
  if (!plugin.target) return
  const plugins = installedPlugins[plugin.target]
  if (plugins.indexOf(plugins) === -1) {
    plugins.push(plugin)
  }
}

export const getPlugins = function (target) {
  return installedPlugins[target]
}

const callInitPlugins = function (target, lifetime, options) {
  const plugins = installedPlugins[target]
  plugins.forEach((plugin) => {
    if (plugin.lifetimes[lifetime]) {
      plugin.lifetimes[lifetime].call(plugin, options)
    }
  })
}

export const callPlugins = function (
  context,
  target,
  name,
  args,
  ...restArgs
) {
  const plugins = installedPlugins[target]
  plugins.forEach((plugin) => {
    plugin.$target = context;
    (plugin.lifetimes[name] || noop).apply(plugin, args.concat(restArgs))
  })
}

const overwrite = function (target, name, options) {
  const fn = options[name] || noop
  options[name] = function (...args) {
    callPlugins(this, target, name, args)
    const res = fn.apply(this, arguments)
    callPlugins(this, target, name + '_end', args, res)
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
  callInitPlugins('app', 'init', options)
  APP_LIFETIMES.forEach(name => overwrite('app', name, options))
  callInitPlugins('app', 'init_end', options)
  return _App(options)
}

Page = function (options) {
  callInitPlugins('page', 'init', options)
  PAGE_LIFETIMES.forEach(name => {
    if (!['onShareAppMessage', 'onShareTimeline', 'onAddToFavorites'].includes(name) || options[name]) {
      overwrite('page', name, options)
    }
  })
  callInitPlugins('page', 'init_end', options)
  return _Page(options)
}

Component = function (options) {
  patch(options)
  callInitPlugins('component', 'init', options)
  COM_LIFETIMES.forEach(name => {
    overwrite('component', name, options)
    overwrite('component', name, options.lifetimes)
  })
  COM_PAGE_LIFETIMES.forEach(name => overwrite('component', name, options.pageLifetimes))
  callInitPlugins('component', 'init_end', options)
  return _Component(options)
}

Behavior = function (options) {
  patch(options)
  callInitPlugins('behavior', 'init', options)
  COM_LIFETIMES.forEach(name => {
    overwrite('behavior', name, options)
    overwrite('behavior', name, options.lifetimes)
  })
  COM_PAGE_LIFETIMES.forEach(name => overwrite('behavior', name, options.pageLifetimes))
  callInitPlugins('behavior', 'init_end', options)
  return _Behavior(options)
}
