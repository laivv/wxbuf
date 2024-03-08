Page({
  data: {
    name: '123',
    list: [{ date: 1709780758743 }, { date: 1709694388973 }]
  },
  formatDate(stamp) {
    return new Date(stamp).toLocaleDateString()
  }
})