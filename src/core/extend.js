import { definePlugin } from "./definePlugin"



const extendMethods = {
  page: {},
  component: {}
}


export function globalExtend(name, value) {
  Object.defineProperty(globalThis, name, {
    get: () => value,
  })
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

export const mountPageExtend = definePlugin({
  options: {
    target: 'page'
  },
  lifetimes: {
    init(options) {
      Object.assign(options, extendMethods.page)
    }
  }
})

export const mountComponentExtend = definePlugin({
  options: {
    target: 'component'
  },
  lifetimes: {
    init(options) {
      Object.assign(options.methods, extendMethods.component)
    }
  }
})