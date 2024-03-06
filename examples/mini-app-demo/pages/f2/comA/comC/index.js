Component({
  // 从组先组件注入数据
  inject: ['text', 'count', 'number', 'total', 'updatePageData'],
  methods: {
    handle() {
      this.updatePageData()
    }
  }
})