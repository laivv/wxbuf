Page({
  listeners: {
    dataChange(e) {
      this.setData({ eventData: e.value })
    }
  }
})