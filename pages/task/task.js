// pages/task/task.js
const app = getApp()
var array_new = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array :[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var that = this;
    console.log(options);
    var status = options.status;
    var serverUrl = app.serverUrl;
    var da = app.getGlobalUserInfo();
    
    //处理管理员
    if (da.data.role == 3){
      if (status == 0){
        status = 8;
      }

      wx.request({
        url: serverUrl + '/survey/manager/tasks?status=' + options.status + "&page=0&size=10",
        method: "GET",
        data: {},
        header: {
          "content-type": "application/json",
          "authorization": da.data.sessionId
        },
        success: function (res) {
          console.log("请求任务列表返回");
          console.log(res.data);
        //  app.num = res.data.data.content.length;
        }

      })
    }else {
      //普通用户
      wx.request({
        url: serverUrl + '/survey/task?status=' + options.status + "&page=0&size=10",
        method: "GET",
        data: {},
        header: {
          "content-type": "application/json",
          "authorization": da.data.sessionId
        },
        success: function (res) {
          console.log("请求任务列表返回");
          console.log(res.data);
          console.log(res.data.data.content);
          console.log(res.data.data.content.length)
         // app.num = res.data.data.content.length;
         // console.log("num:" + num)
          array_new = res.data.data.content;
          that.setData({ array: array_new})
        },
        fail:(res)=>{
          console.log(res.data)
        },
        complete:function(){
          switch (status) {
            case "0":
              console.log("待调查任务");

              wx.setNavigationBarTitle({
                title: '待调查任务' + "(" + array_new.length + ")"
              })
              break;
            case "1":
              wx.setNavigationBarTitle({
                title: '调查中任务' + "(" + array_new.length + ")"
              })
              break;
            case "2":
              wx.setNavigationBarTitle({
                title: '待审核任务' + "(" + array_new.length + ")"
              })
              break;
            case "3":
              wx.setNavigationBarTitle({
                title: '审核中任务' + "(" + array_new.length + ")"
              })
              break;
            case "5":
              wx.setNavigationBarTitle({
                title: '审核失败任务' + "(" + array_new.length + ")"
              })
              break;
          }
        }

      })
    }
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})