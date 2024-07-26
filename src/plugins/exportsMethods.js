import { definePlugin } from "../core/index"
import { isFunction } from "../util"

export default definePlugin({
  targetHooks: {
    component_attached() {
      this.installExportMethods()
    },

    component_detached() {
      this.uninstallExportsMethods()
    },
  },
  methods: {
    installExportMethods() {
      const context = this.$target
      const option = context.$ctorOptions || context
      let { exports } = option
      const parent = context.$parent
      if (exports && parent) {
        if (isFunction(exports)) {
          exports = exports.call(context)
        }
        context.$exports = exports
        const { namespace = null, methods = {} } = exports
        if (namespace && parent[namespace]) return
        let target = parent
        if (namespace) {
          target = parent[namespace] = { $installedBy: context }
        }
        for (let key in methods) {
          const fn = methods[key]
          if (methods.hasOwnProperty(key) && isFunction(fn) && !target[key]) {
            target[key] = fn.bind(context)
            target[key].$installedBy = context
          }
        }
      }
    },
    uninstallExportsMethods() {
      const context = this.$target
      const parent = context.selectOwnerComponent()
      const exports = context.$exports
      if (!parent || !exports) return
      const { namespace = null, methods = {} } = exports
      if (namespace) {
        if (parent[namespace] && parent[namespace].$installedBy === context) {
          delete parent[namespace]
        }
      } else {
        for (let key in methods) {
          if (parent[key] && parent[key].$installedBy === context) {
            delete parent[key]
          }
        }
      }
    }
  }
})
