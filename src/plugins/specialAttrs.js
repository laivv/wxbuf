import { definePlugin } from "../core/index"
import { getPage } from "../utils/index"
import { noop } from "../util"
// add attrs: $components,$page,$parent,$route,$ctorOptions
export default definePlugin({
  targetHooks: {
    app_init_end(options) {
      this.proxy(options, 'onLaunch')
    },
    page_init_end(options) {
      this.proxy(options, 'onLoad')
    },
    component_init_end(options) {
      this.proxy(options, 'created')
    },
    component_attached() {
      this.bindParent()
      this.bindPage()
    },
    component_detached() {
      this.unBindParent()
      this.unBindPage()
    }
  },
  methods: {
    bindPage() {
      const target = this.$target
      const page = getPage(target)
      if (page) {
        target.$page = page
        target.$route = page.route
      }
    },
    unBindPage() {
      const target = this.$target
      delete target.$page
      delete target.$route
    },
    bindParent() {
      const target = this.$target
      const parent = target.selectOwnerComponent()
      if (!parent) return
      target.$parent = parent
      let components = parent.$components
      if (!components) {
        parent.$components = components = []
      }
      if (!components.includes(target)) {
        components.push(target)
      }
    },
    unBindParent() {
      const target = this.$target
      const parent = target.$parent
      if (!parent) return
      const components = parent.$components || []
      const index = components.indexOf(target)
      if (index > -1) {
        components.splice(index, 1)
      }
      delete target.$parent
    },
    proxy(options, key) {
      const option = key === 'created' ? options.lifetimes : options
      const fn = option[key] || noop
      option[key] = function () {
        this.$ctorOptions = options
        return fn.apply(this, arguments)
      }
    }
  }
})
