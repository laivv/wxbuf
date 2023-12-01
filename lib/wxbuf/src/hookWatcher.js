import { isObject, isEmpty } from './util'

export class Watcher {
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

