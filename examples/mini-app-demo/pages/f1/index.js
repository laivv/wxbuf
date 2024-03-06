const dataSource = {
  text: '这是page',
  value: 'page',
  desc: '这是page desc',
}

Page({
  data: {
    ...dataSource,
    count: 1
  },
  // 要传递给后代的数据
  provide: {
    ...dataSource,
    updatePageData() {
      this.setData({ count: this.data.count + 1 })
    }
  }
})