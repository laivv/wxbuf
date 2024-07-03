import { definePlugin } from "../../core/index"
import ProvideObserver from "./provideObserver"
import ProvideWatcher from "./provideWatcher"
import { isFunction, isObject, hasOwn } from "../../util"

export default definePlugin({
  targetHooks: {
    page_setData_end() {
      this.notify()
    },
    component_setData_end() {
      this.notify()
    },
    component_attached() {
      this.initProvide()
    },
    component_detached() {
      this.removeWatcher()
    },
  },
  methods: {
    notify() {
      if (this.$target.$provideObserver) {
        this.$target.$provideObserver.notify()
      }
    },
    getParentProvides() {
      const provides = []
      let parent = this.$target
      let provide = null
      let isStatic
      while ((parent = parent.$parent)) {
        provide = parent.provide
        if (!provide) continue
        isStatic = true
        if (isFunction(provide)) {
          isStatic = false
          provide = provide.call(parent)
        }
        if (isObject(provide)) {
          provides.push({ parent, provide, isStatic })
        }
      }
      return provides
    },
    initProvide() {
      const context = this.$target
      const options = context.$ctorOptions
      const inject = options.inject
      context.provide = options.provide
      if (!Array.isArray(inject) || !inject.length) {
        return
      }
      const provides = this.getParentProvides()
      const data = {}
      inject.forEach(key => {
        const provider = provides.find(({ provide }) => hasOwn(provide, key))
        if (provider) {
          const { parent, provide, isStatic } = provider
          if (!isStatic) {
            this.addWatcher(new ProvideWatcher(parent, context, key))
            this.dependParent(parent)
          }
          this.updateData(parent, provide, key, data)
        }
      })
      if (Object.keys(data).length) {
        this.$target.$setData(data)
      }
    },
    updateData(parent, provide, key, data) {
      const context = this.$target
      const v = provide[key]
      if (isFunction(v)) {
        context[key] = v.bind(parent)
      } else {
        data[key] = v
      }
    },
    addWatcher(watcher) {
      const parent = watcher.parent;
      if (!parent.$provideObserver) {
        parent.$provideObserver = new ProvideObserver()
      }
      parent.$provideObserver.add(watcher)
    },
    removeWatcher() {
      const context = this.$target
      const parents = context.$provideParents || []
      parents.forEach(parent => parent.$provideObserver.remove(context))
      delete context.$provideParents
    },
    dependParent(parent) {
      const context = this.$target
      if (!context.$provideParents) {
        context.$provideParents = []
      }
      if (!context.$provideParents.includes(parent)) {
        context.$provideParents.push(parent)
      }
    }
  }
})