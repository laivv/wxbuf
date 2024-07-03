import { definePlugin } from "../core/index"

export default definePlugin({
  targetHooks: {
    page_setData_end() {
      this.notify()
    },
    component_setData_end() {
      this.notify()
    },
  },
  methods: {
    notify() {
      const components = this.$target.$components || []
      components.forEach(c => {
        const ctor = c.$ctorOptions || {}
        const lifetimes = ctor.parentLifetimes || {}
        if (lifetimes.setData) {
          lifetimes.setData.call(c, c.data)
        }
      })
    }
  }
})

