Page({
  data: {
    list: []
  },
  async handle() {
    const recData = await this.openPage({
      url: '/pages/b1/index',
    })
    if (recData) {
      this.setData({ recData: JSON.stringify(recData) })
    }
  },
  updateData(data) {
    const { list } = this.data
    list.push(JSON.stringify(data))
    this.setData({ list })
  }
})