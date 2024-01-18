Page({
  async handle() {
    this.openPage({
      url: '/pages/a1/index?id=123456',
      params: { name: 'wxbuf', author: 'laivv' },
      body: {
        jsonData: { text: '这是body数据', date: '2024-01-01' }
      },
      success(page) {
        page.setData({ version: 'v1.0.0' })
      }
    })
    if (recData) {
      this.setData({ recData: JSON.stringify(recData) })
    }
  }
})