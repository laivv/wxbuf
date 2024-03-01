Component({
  mixinStore: ['appCount'],
  methods: {
    handle() {
      this.setStore('appCount', this.data.appCount + 1)
    }
  }
})