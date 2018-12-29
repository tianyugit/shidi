// pages/test/test.js
var image_status = true; //图片状态
var src_array = []; //上传图片路径数组
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: true,
    image: "ic_close.png",
    src: {}
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

  }, goTakePic: function () { //启动拍照功能
    console.log("拍照")
    var that = this;
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        console.log(res)
        console.log(res.tempFilePaths)
        src_array = src_array.concat(res.tempFilePaths)
        that.setData({
          src: src_array
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  }, changeImg: function () { //点击切换小图片
    if (image_status == false) {
      this.setData({
        image: "ic_close.png",
        status: true
      })
      image_status = true;

    } else {
      this.setData({
        image: "ic_open.png",
        status: false
      })
      image_status = false;
    }

  } ,previewImage: (e) => { //点击小图预览大图
  console.log("预览图片")
    var that = this,  //获取当前图片的下表    
      index = e.currentTarget.dataset.index;
      //数据源    
     // pictures = this.data.src_array;
    wx.previewImage({
      //当前显示下表   
      current: src_array[index],
      //数据源   
      urls: src_array
    })
  },
})