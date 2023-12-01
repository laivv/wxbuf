import {
  extend,
  hasOwn,
  isEmpty,
  upperCase,
  getRealKey,
  isFunction
} from "./util"
import { pages, components } from './instance'

const MIXIN_NAMES = {
  storage: 'mixinStorage',
  globalData: 'mixinGlobalData'
}

const HOOK_NAMES = {
  storage: 'onStorageChange',
  globalData: 'onGlobalDataChange'
}

let timer = null
let models = []
let _cb = null

const doUpdateView = function (context, option) {
  if (option.mixinGlobalData || option.mixinStorage) {
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
  models.forEach(({ kvs, oldkvs, name }) => {
    const hook = option[HOOK_NAMES[name]]
    if (isFunction(hook)) {
      hook.apply(context, [kvs, oldkvs])
    }
  })
}

export function renderViewAsync(model, cb) {
  if (!_cb) { _cb = cb }
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
    pages.forEach(page => doUpdateView(page, page))
    components.forEach(({ context, option }) => doUpdateView(context, option))
    models.forEach(({ kvs, oldkvs, name }) => {
      const hookName = `on${upperCase(name, 0)}Change`
      _cb(hookName, kvs, oldkvs)
    })
    models = []
  }, 0)
}


