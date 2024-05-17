
import { usePlugin, definePlugin } from '../core/index'
import { pageEventHandlerProxy, componentEventHandlerProxy, behaviorEventHandlerProxy } from '../plugins/eventHandlerProxy'
import shareAppMessage from '../plugins/shareAppMessage'
import shareTimeline from '../plugins/shareTimeline'
import globalShareAppMessage from '../plugins/globalShareAppMessage'
import globalShareTimeline from '../plugins/globalShareTimeline'
import { pageCtorOptions, appCtorOptions, componentCtorOptions } from '../plugins/initCtorOptions'
import pageObservers from '../plugins/pageObservers'
import { computedPage, computedComponent } from '../plugins/computed'
import initSpecialAttrs from '../plugins/initSpecialAttrs'
import { parentLifetimesPage, parentLifetimesComponent } from '../plugins/parentLifetimes'
import pageCache from '../plugins/pageCache'
import { appUserHook, pageUserHook } from '../plugins/userHook'
import { pageProvide, componentProvide } from '../plugins/provide/index'

usePlugin(appCtorOptions)
usePlugin(pageCtorOptions)
usePlugin(componentCtorOptions)
usePlugin(initSpecialAttrs)
usePlugin(pageCache)
usePlugin(pageEventHandlerProxy)
usePlugin(componentEventHandlerProxy)
usePlugin(behaviorEventHandlerProxy)
usePlugin(shareTimeline)
usePlugin(globalShareTimeline)
usePlugin(shareAppMessage)
usePlugin(globalShareAppMessage)
usePlugin(pageObservers)
usePlugin(computedPage)
usePlugin(computedComponent)
usePlugin(parentLifetimesPage)
usePlugin(parentLifetimesComponent)
usePlugin(appUserHook)
usePlugin(pageUserHook)
usePlugin(pageProvide)
usePlugin(componentProvide)

export { usePlugin, definePlugin }

