// pages/changePwd/changePwd.js
const app = getApp()
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
  goChangePwd:function(e){
    var that = this;
    var formObject = e.detail.value;
    var oldPwd = formObject.oldPwd;
    var newPwd = formObject.newPwd;
    var confirmPwd = formObject.confirmPwd;
    if (newPwd != confirmPwd){
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'success',
        duration: 2000
      })
      return;
    } else if (oldPwd == "" || oldPwd==null || 
              newPwd == null || newPwd == "" || 
              confirmPwd == null || confirmPwd == ""){
      wx.showToast({
        title: '请输入密码',
        icon: 'success',
        duration: 2000
      })
      return;
    }
   var da = app.getGlobalUserInfo();
    var url = app.serverUrl;

    wx.request({
      url: url + '/survey/user/passrest',
      method:"PUT",
      data:{
        "oldPassword":oldPwd,
        "newPassword":newPwd
      },
      header:{
        'content-type': 'application/json', // 默认值
        "authorization": da.data.sessionId
      },
      success:function(res){
        console.log("修改密码");
        console.log(res.data);
        if (res.data.status == true) {
          // 修改密码成功
          console.log("修改密码成功");
          wx.showToast({
            title: '修改密码成功',
            icon: 'success',
            duration: 2000
          });
      }else {
        //修改密码失败
          console.log("修改密码失败");
          wx.showToast({
            title: res.error.message,
            icon: 'none',
            duration: 3000
          })
      }
      }
    })
  }

})