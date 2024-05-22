import { definePlugin } from "../core/index"
import { getPage } from "../utils/index"

export default definePlugin({
  lifetimes: {
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
      if(page) {
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
    }
  }
})
