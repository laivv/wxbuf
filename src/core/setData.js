import { callPlugins } from "./plugin"
import { definePlugin } from "./definePlugin"


export default definePlugin({
  lifetimes: {
    page_onLoad: function () {
      this.init('page')
    },
    component_created() {
      this.init('component')
    },
    behavior_created() {
      this.init('behavior')
    }
  },
  methods: {
    init(target) {
      const context = this.$target
      const setData = context.setData
      let pending = false
      context.setData = function (...args) {
        if (pending) {
          return setData.apply(context, arguments)
        }
        pending = true
        callPlugins(context, `${target}_setData`, args)
        setData.apply(context, arguments)
        callPlugins(context, `${target}_setData_end`, args, context.data)
        pending = false
      }
    }
  }
})





