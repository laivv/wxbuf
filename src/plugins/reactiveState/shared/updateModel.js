import { hasOwn, getRealKey, upperCase } from "../../../util"
import { traverseInstance } from "../../shared"

const updateDataSync = function (context, mixinKeys = []) {
  mixinKeys.forEach((key) => {
    const [sourceKey, targetKey] = getRealKey(key)
    if (!hasOwn(kvs, sourceKey)) return
    context.data[targetKey] = kvs[sourceKey]
  })
}


const updateAppDataSync = function (context, kvs, injectName) {
  const mixinConfig = getApp()[injectName]
  if (!mixinConfig) return
  const { keys: mixinKeys, namespace } = mixinConfig
  mixinKeys.forEach((key) => {
    const [sourceKey, targetKey] = getRealKey(key)
    if (!hasOwn(kvs, sourceKey)) return
    if (namespace) {
      if (!context.data[namespace]) {
        context.data[namespace] = {}
      }
      context.data[namespace][targetKey] = kvs[sourceKey]
    } else {
      context.data[targetKey] = kvs[sourceKey]
    }
  })
}

export const updateModelSync = function (kvs, name) {
  const mixinName = `mixin${upperCase(name, 0)}`
  const injectName = `inject${upperCase(name, 0)}`

  traverseInstance((context) => {
    updateDataSync(context, context.$ctorOptions[mixinName])
    updateAppDataSync(context, kvs, injectName)
  })
}