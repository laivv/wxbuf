Component({
  properties: {
    // 页面滚动到底加载数据的回调
    loadData: String,
    text: String
  },
  pageLifetimes: {
    async reachBottom() {
      const { loading, loadData } = this.data
      if (loading || !loadData || !this.$parent[loadData]) return
      this.setData({ loading: true })
      try {
        await this.$parent[loadData]()
      } finally {
        this.setData({ loading: false })
      }
    },
  }
})