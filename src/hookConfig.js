import { isObject, isEmpty } from './util'

class Watcher {
  constructor() {
    this.watchers = []
  }
  add(o) {
    if (isObject(o) && !isEmpty(o)) {
      this.watchers.push(o)
    }
  }
  invoke(name, context, ...argvs) {
    for (let i = 0, len = this.watchers.length; i < len; i++) {
      const o = this.watchers[i]
      if (o.hasOwnProperty(name)) {
        o[name].call(context, ...argvs)
      }
    }
  }
}

let watcher = new Watcher()

export const watchHook = (option = {}) => {
  watcher.add(option)
}

export const callUserHook = function (context, hook, ...args) {
  watcher.invoke(hook, context, ...args)
}



