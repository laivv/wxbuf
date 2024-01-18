Page({
  data: {
    value: 123
  },
  // 要传递给后代的数据
  provide: {
    name: '这是page的name',
    desc: '这是page的desc',
    getPageData() {
      return this.data.value
    }
  }
})