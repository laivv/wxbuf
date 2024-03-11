import {
  extend,
  hasOwn,
  isEmpty,
  getRealKey,
  isFunction
} from "./util"
import {
  getSavedComs,
  getSavedPages,
  getSavedTabBars
} from './instance'

import { callAppHook, getAppConfig } from "./appConfig"

const MIXIN_NAMES = {
  storage: 'mixinStorage',
  store: 'mixinStore'
}

const HOOK_NAMES = {
  storage: 'onStorageChange',
  store: 'onStoreChange'
}

let timer = null
let models = []

const doAppUpdateView = function (context) {
  models.forEach(({ kvs, name }) => {
    const mixinName = MIXIN_NAMES[name]
    const mixinConfig = getAppConfig(mixinName)
    if (!mixinConfig) return
    const { keys: mixinKeys, namespace } = mixinConfig
    let data = namespace ? extend({}, context.data[namespace] || {}) : {}
    mixinKeys.forEach((key) => {
      const [sourceKey, targetKey] = getRealKey(key)
      if (hasOwn(kvs, sourceKey)) {
        data[targetKey] = kvs[sourceKey]
      }
    })
    if (!isEmpty(data)) {
      context.setData(namespace ? { [namespace]: data } : data)
    }
  })
}


const doUpdateView = function (context, option) {
  if (option.mixinStore || option.mixinStorage) {
    const data = {}
    models.forEach(({ kvs, name }) => {
      const mixinKeys = option[MIXIN_NAMES[name]] || []
      mixinKeys.forEach((_key) => {
        const [sourceKey, targetKey] = getRealKey(_key)
        if (hasOwn(kvs, sourceKey)) {
          data[targetKey] = kvs[sourceKey]
        }
      })
    })
    if (!isEmpty(data)) {
      context.setData(data)
    }
  }
}

const callInstanceHook = function (context, option) {
  models.forEach(({ kvs, oldkvs, name }) => {
    const hook = option[HOOK_NAMES[name]]
    if (isFunction(hook)) {
      hook.apply(context, [kvs, oldkvs])
    }
  })
}

export function renderViewAsync(model) {
  stopUpdateView()
  updateModel(model)
  updateView()
}

function updateModel(model) {
  const index = models.findIndex(m => m.name === model.name)
  if (index > -1) {
    const { kvs, oldkvs, name } = models[index]
    model = { kvs: extend(kvs, model.kvs), oldkvs: extend(oldkvs, model.oldkvs), name }
    models.splice(index, 1)
  }
  models.push(model)
}

function stopUpdateView() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function updateView() {
  timer = setTimeout(function () {
    getSavedPages().forEach(page => {
      doUpdateView(page, page)
      doAppUpdateView(page)
      callInstanceHook(page, page)
    })
    getSavedComs().forEach(({ context, option }) => {
      doUpdateView(context, option)
      doAppUpdateView(context)
      callInstanceHook(context, option)
    })
    getSavedTabBars().forEach(tabbar => {
      doUpdateView(tabbar, tabbar.$constructorOptions)
      doAppUpdateView(tabbar)
      callInstanceHook(tabbar, tabbar.$constructorOptions)
    })
    models.forEach(({ kvs, oldkvs, name }) => callAppHook(HOOK_NAMES[name], kvs, oldkvs))
    models = []
  }, 0)
}


