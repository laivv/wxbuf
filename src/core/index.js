
import { usePlugin, getPlugins, callPlugins } from './plugin'
import { definePlugin } from './definePlugin'
import { setDataPage, setDataComponent, setDataBehavior } from './setData'
import { globalExtend, pageExtend, componentExtend, mountComponentExtend, mountPageExtend } from './extend'

usePlugin(setDataPage)
usePlugin(setDataComponent)
usePlugin(setDataBehavior)
usePlugin(mountPageExtend)
usePlugin(mountComponentExtend)

export {
  usePlugin,
  getPlugins,
  callPlugins,
  definePlugin,
  globalExtend,
  pageExtend,
  componentExtend
}

