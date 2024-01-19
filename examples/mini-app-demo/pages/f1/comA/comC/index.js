Component({
  // 从组先组件注入数据
  inject: ['name', 'text', 'desc', 'updatePageData'],
  methods: {
    handle() {
      this.updatePageData()
    }
  }
})