Component({
  pageLifetimes: {
    show(options) {
      console.log('page-params:', this.getUrlParams()) 
    }
  },
  lifetimes: {
    attached() {
      
    }
  },
})