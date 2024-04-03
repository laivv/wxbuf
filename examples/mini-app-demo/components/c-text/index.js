Component({
  externalClasses: ['class'],
  properties: {
    text: {
      type: [String, Number],
      observer(v) {
        this.setData({ flash: true })
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.setData({ flash: false })
        }, 200)
      }
    }
  },
  pageLifetimes: {

  }
})