import { updateModelSync } from '../shared/updateModel'
import { updateViewAsync } from '../shared/updateView'
import { getConfig } from '../../../core/index'

export const getStore = function (key) {
  const store = getApp()[getConfig('storeKey')]
  return store ? (key ? store[key] : store) : undefined
}

export const setStore = function (key, value) {
  const storeKey = getConfig('storeKey')
  const app = getApp()
  const store = app[storeKey]
  if (!store) {
    app[storeKey] = store = {}
  }
  const oldValue = store[key]
  store[key] = value
  const kvs = { [key]: value }
  const oldkvs = { [key]: oldValue }
  updateModelSync(kvs, 'store')
  updateViewAsync({ kvs, oldkvs, name: 'store' })
}


