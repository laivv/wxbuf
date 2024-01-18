Component({
  // 从组先组件注入数据
  inject: ['name', 'text', 'desc', 'getPageData'],
  lifetimes: {
    attached() {
      const value = this.getPageData()
      this.setData({ pageValue: value })
    }
  }
})