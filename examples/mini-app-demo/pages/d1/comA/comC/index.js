Component({
  mixinGlobalData: ['appCount'],
  methods: {
    handle() {
      this.setGlobalData('appCount', this.data.appCount + 1)
    }
  }
})