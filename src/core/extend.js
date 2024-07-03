import { definePlugin } from "./kernel"

const extendMethods = {
  page: {},
  component: {}
}

wx = Object.assign(Object.create(wx.__proto__), wx)

export function globalExtend(name, value) {
  Object.defineProperty(globalThis, name, {
    get: () => value,
  })
}

export function wxExtend(name, value) {
  wx[name] = value
}

export function pageExtend(object) {
  Object.assign(extendMethods.page, object)
}

export function componentExtend(object) {
  Object.assign(extendMethods.component, object)
}

export function getExtends(target) {
  return extendMethods[target]
}

export const mountExtend = definePlugin({
  targetHooks: {
    page_init(options) {
      Object.assign(options, extendMethods.page)
    },
    component_init(options){
      Object.assign(options.methods, extendMethods.component)
    }
  }
})
