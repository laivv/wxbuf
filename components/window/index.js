Component({
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