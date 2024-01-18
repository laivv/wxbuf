Page({
  data: {
    total: 1
  },
  computed: {
    totalText() {
      return `总数量是${this.data.total}`
    }
  },
  handle() {
    this.setData({ total: this.data.total + 1 })
  }
})