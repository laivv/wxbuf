Component({
  pageLifetimes: {
    // wxbuf 修复了这个show不工作的官方bug，这个钩子现在可以正常工作
    show() {
      this.setData({ route: this.$route })
    }
  },
  data: {
    list: [{
      pagePath: "pages/home/index",
      text: "首页",
      iconPath: "/images/home.png",
      selectedIconPath: "/images/home1.png"
    },
    {
      pagePath: "pages/more/index",
      text: "更多",
      iconPath: "/images/my.png",
      selectedIconPath: "/images/my1.png",
    },
    {
      pagePath: "pages/my/index",
      text: "我的",
      iconPath: "/images/my.png",
      selectedIconPath: "/images/my1.png",
    },
  ]
  },
  methods: {
    handleSwitchTab(e, { url }) {
      wx.switchTab({ url })
    }
  }
})