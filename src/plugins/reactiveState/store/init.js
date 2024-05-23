import { getConfig } from "../../../core/index"
import { getRealKey, extend } from "../../../util"

export const initStore = function (option, context) {
  const store = getApp()[getConfig('storeKey')];
  const mixinKeys = option.mixinStore
  if (!Array.isArray(mixinKeys)) return
  const data = {}
  mixinKeys.forEach(key => {
    const [sourceKey, targetKey] = getRealKey(key)
    data[targetKey] = store[sourceKey]
  })
  context.setData(data)
}

export const initAppStore = function (context) {
  const store = getApp()[getConfig('storeKey')];

  const mixinConfig = getApp().injectStore
  if (!mixinConfig) return
  const mixinKeys = mixinConfig.keys
  const namespace = mixinConfig.namespace
  if (!Array.isArray(mixinKeys)) return
  const data = {}
  mixinKeys.forEach(key => {
    const [sourceKey, targetKey] = getRealKey(key)
    data[targetKey] = store[sourceKey]
  })
  if (namespace) {
    const _data = extend({}, context.data[namespace] || {}, data)
    context.setData({ [namespace]: _data })
  } else {
    context.setData(data)
  }

}