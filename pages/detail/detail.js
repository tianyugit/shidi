// pages/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:null,
    datas:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // var data = options.data
    console.log(options)
    if (options.point == "null"){
      options.point ="暂无";
      console.log(options)
    }
    this.setData({ detail:options})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  goSubmit:function(e){
    var that = this;
    var da = app.getGlobalUserInfo();
    var formObject = e.detail.value;
    var id = formObject.id;
    var url = app.serverUrl + '/survey/core/task/template/' + id;
    console.log(id);
    wx.request({
      url: url,
      method:"GET",
      data:{},
      header:{
        'content-type': 'application/json', // 默认值
        "authorization": da.data.sessionId
      },
      success:function(res){
        console.log("继续调查")
        //  console.log(res.data);
        that.setData({ datas: res.data })
      }
    })
    wx.redirectTo({
      url: '/pages/survey/survey?url=' + url + "&taskId=" + id,
    })
  }
 
})