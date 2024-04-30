Component({
  properties: {
    userId: String
  },
  externalClasses: ['class'],
  data: {
    subscribe: false
  },
  methods: {
    handleTap() {
      const { userId, subscribe } = this.data
      // 获取同胞组件列表
      this.getCognates().filter(c => c.data.userId === userId).forEach(c => c.setData({ subscribe: !subscribe }))
    }
  }
})