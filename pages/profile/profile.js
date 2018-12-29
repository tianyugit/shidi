// pages/profile/profile.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  goLogout: function(){
    var serverUrl = app.serverUrl;
    var da = app.getGlobalUserInfo();
   
    console.log(da.data.sessionId);
    wx.request({
      url: serverUrl + '/survey/user/logout',
      method: "DELETE",
      data: {
       
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': da.data.sessionId
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == true) {
          // 登录成功跳转 
          wx.showToast({
            title: '注销成功',
            icon: 'success',
            duration: 3000
          });
          
          wx.redirectTo({
                 url: '../index/index',
          })

        } else if (res.data.status == false) {
          // 失败弹出框
          wx.showToast({
            title: res.data.error.message,
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  } 
 
})