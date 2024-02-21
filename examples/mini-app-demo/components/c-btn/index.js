Component({
  options: {
    virtualHost: true
  },
  externalClasses: ['class'],
  properties: {
    // 绑定的handler名称
    onClick: String,
    style: String,
    loadingText: String
  },
  methods: {
    async handleTap(e) {
      const { onClick, loading } = this.data
      if (onClick && typeof this.$parent[onClick] === 'function' && !loading) {
        this.setData({ loading: true })
        try {
          await this.$parent[onClick](e)
        }
        finally {
          this.setData({ loading: false })
        }
      }
    }
  }
})