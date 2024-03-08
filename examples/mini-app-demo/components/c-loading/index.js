Component({
  properties: {
    // 加载数据的handler名称
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