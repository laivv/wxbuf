Page({
  handle() {
    // 以下将向新页面传递5个字段，它们分别是： id、name、author、jsonData、version
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
  }
})