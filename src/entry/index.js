
import { usePlugin, definePlugin, watch, config, page, component, global } from '../core/index'
import eventHandlerProxy from '../plugins/eventHandlerProxy'
import shareAppMessage from '../plugins/shareAppMessage'
import shareTimeline from '../plugins/shareTimeline'
import globalShareAppMessage from '../plugins/globalShareAppMessage'
import globalShareTimeline from '../plugins/globalShareTimeline'
import initCtorOptions from '../plugins/initCtorOptions'
import pageObservers from '../plugins/pageObservers'
import computed from '../plugins/computed'
import initSpecialAttrs from '../plugins/initSpecialAttrs'
import parentLifetimes from '../plugins/parentLifetimes'
import pageCache from '../plugins/pageCache'
import userHook from '../plugins/userHook'
import provide from '../plugins/provide/index'
import navigate from '../plugins/navigate/index'
import exportsMethods from '../plugins/exportsMethods'
import listeners from '../plugins/listeners'

usePlugin(initCtorOptions)
usePlugin(initSpecialAttrs)
usePlugin(pageCache)
usePlugin(eventHandlerProxy)
usePlugin(shareTimeline)
usePlugin(globalShareTimeline)
usePlugin(shareAppMessage)
usePlugin(globalShareAppMessage)
usePlugin(computed)
usePlugin(pageObservers)
usePlugin(parentLifetimes)
usePlugin(userHook)
usePlugin(provide)
usePlugin(navigate)
usePlugin(exportsMethods)
usePlugin(listeners)


export {
  usePlugin,
  definePlugin,
  watch,
  config,
  page,
  component,
  global
}

