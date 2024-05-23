import {
  extend,
  hasOwn,
  isEmpty,
  getRealKey,
  isFunction
} from "../../../util"

import { traverseInstance } from "../../shared"

const MIXIN_NAMES = {
  storage: 'mixinStorage',
  store: 'mixinStore'
}

const INJECT_NAMES = {
  storage: 'injectStorage',
  store: 'injectStore'
}

const HOOK_NAMES = {
  storage: 'onStorageChange',
  store: 'onStoreChange'
}

let timer = null
let models = []

const doAppUpdateView = function (context) {
  models.forEach(({ kvs, name }) => {
    const mixinName = INJECT_NAMES[name]
    const mixinConfig = getApp()[mixinName]
    if (!mixinConfig) return
    const { keys: mixinKeys, namespace } = mixinConfig
    let data = namespace ? extend({}, context.data[namespace] || {}) : {}
    mixinKeys.forEach((key) => {
      const [sourceKey, targetKey] = getRealKey(key)
      if (!hasOwn(kvs, sourceKey)) return
      data[targetKey] = kvs[sourceKey]
    })

    if (isEmpty(data)) return
    context.setData(namespace ? { [namespace]: data } : data)

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

const app = getApp()

function updateView() {
  timer = setTimeout(function () {
    traverseInstance((context) => {
      doUpdateView(context, context.$ctorOptions)
      doAppUpdateView(context)
      callInstanceHook(context, context.$ctorOptions)
    })
    models.forEach(({ kvs, oldkvs, name }) => {
      if (app[HOOK_NAMES[name]]) {
        app[HOOK_NAMES[name]](kvs, oldkvs)
      }
    })
    models = []
  }, 0)
}

export function updateViewAsync(model) {
  stopUpdateView()
  updateModel(model)
  updateView()
}


