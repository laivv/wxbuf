
import { usePlugin, getPlugins, callPlugins } from './plugin'
import { definePlugin } from './definePlugin'
import { setDataPage, setDataComponent, setDataBehavior } from './setData'

usePlugin(setDataPage)
usePlugin(setDataComponent)
usePlugin(setDataBehavior)

export { usePlugin, getPlugins, callPlugins, definePlugin }

