import { definePlugin } from "../core/index"

// 给app，page，component实例挂载$ctorOptions属性，值为原始的构造器参数
export const appCtorOptions = definePlugin({
  options: {
    target: 'app',
  },
  lifetimes: {
    init(options) {
      this.options = options
    },
    onLaunch() {
      this.$target.$ctorOptions = this.options
    }
  }
})

export const pageCtorOptions = definePlugin({
  options: {
    target: 'page',
  },
  lifetimes: {
    init(options) {
      this.options = options
    },
    onLoad() {
      this.$target.$ctorOptions = this.options
    }
  }
})

export const componentCtorOptions = definePlugin({
  options: {
    target: 'component',
  },
  lifetimes: {
    init(options) {
      this.options = options
    },
    created() {
      this.$target.$ctorOptions = this.options
    }
  }
})
