Component({
  provide: {
      a1: 'a1 is window',
  },
  pageMethods: {

  },
  pageLifetimes:{
    pullDownRefresh(){
      console.log('component-parent-page-onPullDownRefresh')
    },
    reachBottom(){
      console.log('page-reach-bottom')
    }
  }
})