Page({
  data: {
    n: 0
  },
  async handleLoadMore() {
    await new Promise(resolve => setTimeout(() => {
      this.setData({ n: this.data.n + 10 })
      resolve()
    }, 3000))
  }
})