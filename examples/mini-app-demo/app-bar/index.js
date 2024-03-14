Component({
  pageLifetimes: {
    show() {
    },
  },
  lifetimes: {
    attached() {
    }
  },
  data: {
  },
  methods: {
    handle() {
      wx.navigateBack()
    }
  }
})