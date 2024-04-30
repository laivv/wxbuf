Component({
  properties: {
    // 加载数据的handler名称
    loadData: String,
    text: String,
    immediate: {
      type: Boolean,
      value: true
    },
    pagination: {
      type: Boolean,
      value: false
    }
  },
  lifetimes: {
    attached() {
      if (this.data.immediate) {
        this.execute()
      }
    }
  },
  pageLifetimes: {
    reachBottom() {
      if(this.data.pagination) {
        this.execute()
      }
    },
  },
  methods: {
    async execute() {
      const { loading, loadData } = this.data
      if (loading || !loadData || !this.$parent[loadData]) return
      this.setData({ loading: true })
      try {
        await this.$parent[loadData]()
      } finally {
        this.setData({ loading: false })
      }
    }
  }
})