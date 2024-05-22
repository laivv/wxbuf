
import { usePlugin, getPlugins, callPlugins } from './plugin'
import { watch } from './watch'
import { config, getConfig } from './config'
import { definePlugin } from './definePlugin'
import setData from './setData'
import { globalExtend, pageExtend, componentExtend, mountExtend } from './extend'

usePlugin(setData)
usePlugin(mountExtend)


const page = { extend: pageExtend }
const global = { extend: globalExtend }
const component = { extend: componentExtend }

export {
  usePlugin,
  getPlugins,
  callPlugins,
  definePlugin,
  globalExtend,
  pageExtend,
  componentExtend,
  watch,
  global,
  page,
  component,
  config,
  getConfig,
}
