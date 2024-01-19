Component({
  pageLifetimes: {
    pageScroll() {
      if (!this.data.scrolling) {
        this.setData({ scrolling: true })
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.setData({ scrolling: false })
      }, 1000)
    },
  }
})