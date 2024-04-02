Component({
  // 从组先组件注入数据
  inject: ['text', 'count', 'number', 'total', 'updatePageData'],
  computed: {
    totalText() {
      return `总共${this.data.total}个`
    }
  },
  methods: {
    handle() {
      this.updatePageData()
    }
  }
})