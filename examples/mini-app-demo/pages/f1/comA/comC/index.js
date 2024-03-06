Component({
  // 从组先组件注入数据
  inject: ['text', 'value', 'desc', 'updatePageData'],
  methods: {
    handle() {
      this.updatePageData()
    }
  }
})