Component({
  mixinStorage: ['count'],
  methods: {
    handle() {
      this.setStorageSync('count', this.data.count + 1)
    },
    handleRemove() {
      this.removeStorageSync('count')
    }
  }
})