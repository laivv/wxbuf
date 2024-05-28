import { getConfig } from "../../../core/index"
import { getRealKey, extend } from "../../../util"

export const initStore = function (option, context) {
  const mixinKeys = option.mixinStore
  if (!Array.isArray(mixinKeys) || !mixinKeys.length) return
  const data = {}
  const store = getApp()[getConfig('storeKey')];
  mixinKeys.forEach(key => {
    const [sourceKey, targetKey] = getRealKey(key)
    data[targetKey] = store[sourceKey]
  })
  context.$setData(data)
}

export const initAppStore = function (context) {
  
  const mixinConfig = getApp().injectStore
  if (!mixinConfig) return
  const store = getApp()[getConfig('storeKey')];
  const mixinKeys = mixinConfig.keys
  const namespace = mixinConfig.namespace
  if (!Array.isArray(mixinKeys) || !mixinKeys.length) return
  const data = {}
  mixinKeys.forEach(key => {
    const [sourceKey, targetKey] = getRealKey(key)
    data[targetKey] = store[sourceKey]
  })
  if (namespace) {
    const _data = extend({}, context.data[namespace] || {}, data)
    context.$setData({ [namespace]: _data })
  } else {
    context.$setData(data)
  }

}