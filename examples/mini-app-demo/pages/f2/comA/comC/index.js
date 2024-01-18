Component({
  // 从组先组件注入数据
  inject: ['pageText', 'pageCount', 'comNumber', 'pageDataUpdate'],
  methods: {
    handle() {
      this.pageDataUpdate()
    }
  }
})