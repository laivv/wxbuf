import { definePlugin } from "../../core/index"
import ProvideObserver from "./provideObserver"
import ProvideWatcher from "./provideWatcher"
import { isFunction, isObject, hasOwn } from "../../util"

export const pageProvide = definePlugin({
  options: {
    target: 'page'
  },
  lifetimes: {
    setData_end() {
      if (this.$target.$provideObserver) {
        this.$target.$provideObserver.notify()
      }
    }
  }
})

export const componentProvide = definePlugin({
  options: {
    target: 'component'
  },
  lifetimes: {
    attached() {
      this.initProvide()
    },
    detached() {
      this.removeWatcher()
    },
    setData_end() {
      if (this.$target.$provideObserver) {
        this.$target.$provideObserver.notify()
      }
    }
  },
  methods: {
    getParentProvides() {
      const provides = []
      let parent = this.$target
      let provide = null
      let isStatic
      while ((parent = parent.$parent)) {
        provide = parent.$ctorOptions.provide
        if (!provide) continue
        isStatic = true
        if (isFunction(provide)) {
          isStatic = false
          provide = parent.provide()
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
      if (!Array.isArray(inject) || !inject.length) {
        return
      }
      const provides = this.getParentProvides()
      inject.forEach(key => {
        for (let i = 0; i < provides.length; i++) {
          const { parent, provide, isStatic } = provides[i]
          if (!hasOwn(provide, key)) continue
          if (!isStatic) {
            this.addWatcher(new ProvideWatcher(parent, context, key))
            this.dependParent(parent)
          }
          this.updateData(provide, key)
          break
        }
      })
    },
    updateData(provide, key) {
      const context = this.$target
      const v = provide[key]
      if (isFunction(v)) {
        context[key] = v.bind(parent)
      } else {
        context.setData({ [key]: v })
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