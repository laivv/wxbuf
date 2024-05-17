import { definePlugin } from "../core/index"

export default definePlugin({
  options: {
    target: 'component',
  },
  lifetimes: {
    attached() {
      this.bindParent()
    },
    detached() {
      this.unBindParent()
    }
  },
  methods: {
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
