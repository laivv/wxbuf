import {
  page,
  watch,
  global,
  config,
  usePlugin,
  component,
  definePlugin
} from '../core/index'
import {
  computed,
  navigate,
  pageCache,
  callWatch,
  listeners,
  pageOnInit,
  specialAttrs,
  reactiveStore,
  shareTimeline,
  provideInject,
  asyncOnLaunch,
  pageObservers,
  exportsMethods,
  parentLifetimes,
  shareAppMessage,
  reactiveStorage,
  eventHandlerProxy,
  globalShareTimeline,
  globalShareAppMessage,
  componentPageLifetimes
} from '../plugins/index'

usePlugin(specialAttrs)
usePlugin(pageCache)
usePlugin(eventHandlerProxy)
usePlugin(shareTimeline)
usePlugin(globalShareTimeline)
usePlugin(shareAppMessage)
usePlugin(globalShareAppMessage)
usePlugin(pageObservers)
usePlugin(parentLifetimes)
usePlugin(callWatch)
usePlugin(provideInject)
usePlugin(navigate)
usePlugin(exportsMethods)
usePlugin(listeners)
usePlugin(reactiveStorage)
usePlugin(reactiveStore)
usePlugin(computed)
usePlugin(componentPageLifetimes)
usePlugin(pageOnInit)
usePlugin(asyncOnLaunch)

export {
  page,
  watch,
  config,
  global,
  component,
  usePlugin,
  definePlugin,
}

