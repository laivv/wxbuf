
import {
  usePlugin,
  definePlugin,
  watch,
  config,
  page,
  component,
  global
} from '../core/index'
import {
  eventHandlerProxy,
  shareAppMessage,
  shareTimeline,
  globalShareAppMessage,
  globalShareTimeline,
  pageObservers,
  computed,
  specialAttrs,
  parentLifetimes,
  pageCache,
  callWatch,
  provideInject,
  navigate,
  exportsMethods,
  listeners,
  asyncOnLaunch,
  reactiveStorage,
  reactiveStore,
  pageOnInit

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
usePlugin(pageOnInit)
usePlugin(asyncOnLaunch)

export {
  usePlugin,
  definePlugin,
  watch,
  config,
  page,
  component,
  global
}

