//app.js
//https://sdxt.99hry.com:2801/login
App({
  //serverUrl: "https://vm.99hry.com:40084",
  serverUrl: "http://14.23.71.164:40081",
 //serverUrl: "https://sdxt.99hry.com:2801",
  userInfo: null,
  setGlobalUserInfo: function (user) {
    wx.setStorageSync("userInfo", user);
  },

  getGlobalUserInfo: function () {
    return wx.getStorageSync("userInfo");
  },
  onLaunch: function () {
   
    var that = this
    //获取屏幕尺寸，放到全局结构中
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.scHeight = res.windowHeight
        that.globalData.scWidth = res.windowWidth
      },
    })
  //  console.log(this.globalData.scWidth)
    //console.log(this.globalData.scHeight)
  },
  globalData: {
    userInfo: null,
    scWidth: 0,             //全局的屏幕尺寸，已经去掉了上边的标题栏
    scHeight: 0
  }
})