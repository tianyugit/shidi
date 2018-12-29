Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: [
      { status: '0', name: '待调查任务' },
      { status: '1', name: '调查中任务' },
      { status: '2', name: '待审核任务' },
      { status: '3', name: '审核中任务' },
      { status: '5', name: '审核失败任务' }
    ]
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

})