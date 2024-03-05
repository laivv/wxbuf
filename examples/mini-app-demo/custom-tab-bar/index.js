Component({
  mixinStore: ['tabbars -> list'],
  pageLifetimes: {
    // wxbuf 修复了这个show不工作的官方bug，这个钩子现在可以正常工作
    show() {
      this.setData({ route: this.$route })
    }
  },
  methods: {
    handleSwitchTab(e, { url }) {
      wx.switchTab({ url: url })
      this.clearBadge()
    },
    clearBadge() {
      const { list } = this.data
      list[1].count = 0
      this.setStore('tabbars', list)
    }
  }
})