Page({
  async handle() {
    const recData = await this.openPage({
      url: '/pages/b1/index',
    })
    if (recData) {
      this.setData({ recData: JSON.stringify(recData) })
    }
  }
})