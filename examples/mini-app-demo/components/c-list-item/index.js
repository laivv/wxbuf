Component({
  options: {
    virtualHost: true
  },
  properties: {
    url: String
  },
  methods: {
    handle() {
      this.openPage({ url: this.data.url })
    }
  }
})