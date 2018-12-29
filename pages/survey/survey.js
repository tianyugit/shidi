// pages/survey/survey.js
const app = getApp();
var url = app.serverUrl; //后台链接
var da = app.getGlobalUserInfo(); //登录的用户

var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');

var util = require('../../utils/util.js');
var qqmapsdk;
var taskId; //任务id
//var image_status = true; //图片状态
//var src_array = []; //上传图片路径数组
var record_status = false; //录音状态
var record_array = new Array(); //本地录音列表
var audios = new Array(); //后台返回的录音列表
var photos = {}; //后台返回的图片列表
var image_status = {}; //调查图片界面点击小图标的状态数组
var src_json = {
  "src_comp": [],
  "src_door": [],
  src_business: [],
  src_doc: [],
  src_product: [],
  src_other: []
  
}; //上传路径json集
//初始化全部为关闭状态小图片
var images = {
  image_comp: "ic_close.png",
  image_door: "ic_close.png",
  image_business: "ic_close.png",
  image_doc: "ic_close.png",
  image_product: "ic_close.png",
  image_other: "ic_close.png",
};
//下面是隐藏添加按钮的状态
var statusList = {
  'comp_status': true,
  'door_status': true,
  'business_status': true,
  'doc_status': true,
  'product_status': true,
  'other_status': true
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: null,
    location: null,
    longitude: 0,  //当前经度
    latitude: 0,   //当前纬度
    actualLatitude:0,  //实际纬度
    actuallongitude:0, //实际经度
    val: true,
    src:{},
    status: {},
    image: {},
    record_image: "record.png",
    record_list: {}, //录音列表
    audios_list: [], //后台返回的录音列表
    photos_list: [], //后台返回的录音列表
    //record_status:"未上传",
    markers: [],
    tap_status: {},
    mapControls: [{ //定位
        id: 0,
        position: { //相对定位
          left: app.globalData.scWidth * 0.03,
          top: app.globalData.scHeight * 0.79,
          width: app.globalData.scWidth * 0.1
        },
        iconPath: "/images/location-control.png", //相对于当前文件的路径
        clickable: true
      },
      { //地图中心
        id: 14,
        position: { //相对定位
          left: app.globalData.scWidth * 0.39,
          top: app.globalData.scHeight * 0.38,
          width: 90,
          height: 45

        },
        iconPath: "/images/place2.png",
        clickable: true
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'IEZBZ-UKBWI-LSRGR-5YVTS-OEZXT-2QF5K' //开发者key
    });
    this.myMapCtx = wx.createMapContext("myMap", this)
    this.getLocation()
    this.ctx = wx.createCameraContext(); //获取拍照对象
    this.recorderManager = wx.getRecorderManager(); //获取录音对象
    this.innerAudioContext = wx.createInnerAudioContext() //获取播放音频对象

    var that = this;
    record_array = [];
    var array = {
      "status_map": false
    }
    var statusList = {
      // "comp_status":true
    }
    //初始化小图片
    var images = {
      image_comp: "ic_close.png",
      image_door: "ic_close.png",
      image_business: "ic_close.png",
      image_doc: "ic_close.png",
      image_product: "ic_close.png",
      image_other: "ic_close.png"
    };

    // console.log("sssaaa:" + images.image_doc)

    console.log(options)
    this.setData({
      link: options.url,
      tap_status: array,
      status: statusList,
      image: images
    })
    taskId = options.taskId; //获取任务id
    console.log("taskId:" + taskId)
    //发送后台加载页面初始化数据
    wx.request({
      url: url + '/survey/task/' + taskId,
      method: "GET",
      header: {
        "content-type": "application/json",
        "authorization": da.data.sessionId
      },
      success: function(res) {
        console.log("初始化数据:")
        console.log(res.data)
        audios = res.data.data.audios;
        photos = res.data.data.photos
        console.log(audios)
        console.log(photos)

        that.setData({
          audios_list: audios

        })
      }

    })

    

  },
  getLocation: function() { //获取当前位置，并移动地图到当前位置
    this.myMapCtx.moveToLocation()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    wx.getLocation({ //获取用户当前位置
      altitude: true,
      success: function(res) {
        //  console.log(res.latitude);  //纬度
        //  console.log(res.longitude); //经度
        qqmapsdk.reverseGeocoder({ //调用腾讯地图api获取位置中文名
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          poi_options: 'policy=1',
          success: function(res) {
            console.log(res);
            that.setData({
              location: res.result.formatted_addresses.recommend
            })

          },
          fail: function(res) {
            console.log(res);
          }
        });
        // var mk = [{
        //   iconPath: "/images/local.png",
        //   id: 0,
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        //   width: 55,
        //   height: 30
        // }];
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          actualLatitude: res.latitude,
          actualLongitude: res.longitude
          // markers: mk
        })

      },
      fail: function(res) {}
    });

  },
  markertap: function() { //点击标记签到
    var that = this;
    // var url = app.serverUrl;
    // var da = app.getGlobalUserInfo();
    //console.log("ddd:" + taskId);
    wx.request({

      url: url + "/survey/" + taskId + "/sign",
      method: "POST",
      data: {
        "signLatitude": that.latitude,
        "signLongitude": that.longitude,
        "actualLatitude": that.actualLatitude,
        "actualLongitude": that.actualLongitude
      },
      header: {
        "content-type": "application/json",
        "authorization": da.data.sessionId
      },
      success: function(res) {
        console.log(res.data);
        var status = res.data.status;
        if (status == false) {
          console.log(res.data.error.message)
          wx.showModal({
            title: '请确认',
            content: '已经签到过,请不要重复签到'
          })
        }
      }
    })
  },
  getLocations: function() { //获取用户地址
    var that = this;
    console.log("点击了")
    wx.getLocation({
      altitude: true,
      success: function(res) {
        console.log(res.latitude); //纬度
        console.log(res.longitude); //经度
        // var mk = [{
        //   iconPath: "/images/local.png",
        //   id: 0,
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        //   width: 85,
        //   height: 45
        // }];
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          // markers: mk
        })
      },
      fail: function(res) {}
    });
  },
  regionChanged: function(e) { //地图视野改变
    if (e.type == "end") {
      var that = this
      this.myMapCtx.getCenterLocation({ //获取中心点的经纬度
        success: function(res) {
          var mark = that.data.markers
          var id = that.data.markers.length
          var width = app.globalData.scWidth * 0.1
          console.log(res.longitude); //经纬度
          console.log(res.latitude);

          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            poi_options: 'policy=1',
            success: function(res) {
              console.log(res);
              that.setData({
                location: res.result.formatted_addresses.recommend
              })

            },
            fail: function(res) {
              console.log(res);
            },
            complete: function(res) {
              //  console.log(res);
            }
          });
        }

      })
    }
  },

  mapControlTap: function(e) { //地图控件点击
    switch (e.controlId) {
      case 0: //定位
        this.getLocation()
        break;
      case 14: //地图中心
        console.log("签到点击")
        this.markertap();
        break;
    }
  },
  mapTap: function(e) { //地图点击
    //console.log(e)
  },
  changeImg: function(e) { //点击切换小图片
    console.log(e.currentTarget.id);
    var id = e.currentTarget.id;
    var myStatus = true;
    if (image_status.hasOwnProperty(id)) {
      console.log("有")
      myStatus = true
    } else {
      console.log("无")
      image_status[id] = id; //添加进来，状态为有
      myStatus = false //点击状态，为状态
    }
    console.log(image_status)

    if (myStatus == false) {///处理展开

      //遍历json，如果有该key，根据key更新小图片
      for (var key in image_status) {
        console.log(image_status[key])
        images["image_" + image_status[key]] = "ic_open.png";//更改为关闭状态
        statusList[image_status[key] +"_status"] = false;　　//更改为展开状态
      }

      this.setData({
        image: images,
        status: statusList
      })
      myStatus = true;

    } else {//处理点击状态为关闭
      
      images["image_" + id] = "ic_close.png"; //更好关闭小图片
      statusList[id + "_status"] = true;　　//更新展开状态
      this.setData({
        image: images,
        status: statusList
      })
      myStatus = false;
      delete image_status[id];

    }
    //console.log(image_status)
  },
  goTakePic: function(e) { //启动拍照功能
    console.log("拍照")
    console.log(e.currentTarget.id);
    var id = e.currentTarget.id;
    id = id.split("_")[1];
    console.log(id)

    var that = this;
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        // success
        console.log(res)
        console.log(res.tempFilePaths)
        var key = "src_" + id;
        src_json["src_" + id] = src_json["src_"+id].concat(res.tempFilePaths)
        //console.log("结果："+src_json["src_" + id])
        switch(id){
          case "comp":
            that.setData({
              src_comp: src_json["src_" + id]
            })
            break
          case "door":
            that.setData({
              src_door: src_json["src_" + id]
            })
            break
          case "business":
            that.setData({
              src_business: src_json["src_" + id]
            })
            break
          case "doc":
            that.setData({
              src_doc: src_json["src_" + id]
            })
            break
          case "product":
            that.setData({
              src_product: src_json["src_" + id]
            })
            break
          case "other":
            that.setData({
              src_other: src_json["src_" + id]
            })
            break
        }
        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })

  },
  deleteImg:function(e){ //长按删除图片
    console.log("长按删除图片");
    var index = e.currentTarget.dataset.index;
    var id = index.split("_")[0];
    index = index.split("_")[1];
    console.log(index);
    console.log(id);
    var that = this
    //删除图片
    wx.showModal({
      title: '提示',
      content: '是否要删除图片?',
      showCancel: true,
      success: function (res) {
        console.log("删除图片")

        src_json["src_" + id].splice(index, 1);
        switch (id) {
          case "comp":
            that.setData({
              src_comp: src_json["src_" + id]
            })
            break
          case "door":
            that.setData({
              src_door: src_json["src_" + id]
            })
            break
          case "business":
            that.setData({
              src_business: src_json["src_" + id]
            })
            break
          case "doc":
            that.setData({
              src_doc: src_json["src_" + id]
            })
            break
          case "product":
            that.setData({
              src_product: src_json["src_" + id]
            })
            break
          case "other":
            that.setData({
              src_other: src_json["src_" + id]
            })
            break
        }
        
      }
    })
   
  },
  previewImage: (e) => { //点击小图预览大图
   // var that = this, //获取当前图片的下表    
    var index = e.currentTarget.dataset.index;
    var id = index.split("_")[0]
    index = index.split("_")[1]
    
    //数据源    
    //  pictures = this.data.src_array; 
    wx.previewImage({
      //当前显示下表   
      current: src_json["src_" + id][index],
      //数据源   
      urls: src_json["src_" + id]
    })
  },
  getRecord: function() { //启动录音功能
    const options = {
      duration: 600000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }

    if (record_status == false) {
      console.log("开始录音")
      this.setData({
        record_image: "record_1.png"
      })
      this.recorderManager.start(options);
      record_status = true;
      this.recorderManager.onStart(() => {
        console.log('recorder start')
      })
    } else {
      //停止录音
      console.log("停止录音")
      this.recorderManager.stop();
      this.recorderManager.onStop((res) => {
        console.log('recorder stop', res)
        console.log(res.tempFilePath)

        var time = util.formatTime(new Date());
        var record_data = {
          "name": time,
          "path": res.tempFilePath,
          "record_status": '未上传'
        }
        record_array.push(record_data)
        console.log(record_array)
        this.setData({
          record_list: record_array
        })
      })
      record_status = false;
      this.setData({
        record_image: "record.png"
      })
    }

  },
  deleteRecord: function(e) { //长按删除未上传录音
    var that = this;
    var index; //数组下标
    console.log(e.currentTarget.id) //获取元素id
    var id = e.currentTarget.id;
    console.log(id.split("_")[1])
    index = id.split("_")[1];

    wx.showModal({
      title: '提示',
      content: '是否要删除录音?',
      showCancel: true,
      success: function(res) {
        console.log("删除录音")
        if (res.confirm){
          record_array.splice(index, 1);
          that.setData({
            record_list: record_array
          })
        }

        
      }
    })
  },
  deleteRecordByUpload: function(e) { //上传已上传的
    var that = this;
    var index; //数组下标
    console.log(e.currentTarget.id) //获取元素id
    var id = e.currentTarget.id;
    console.log(id.split("_")[1])
    index = id.split("_")[1];

    wx.showModal({
      title: '提示',
      content: '是否要删除录音?',
      showCancel: true,
      success: function(res) {
        console.log("删除录音")
        // var sta;
        // console.log(record_array[index])
        // console.log(eval("(" + record_array[index] + ")"))

        // if (JSON.parse(record_array[index]).hasOwnProperty("record_status")) {
        //   if (record_array[index].record_status == "未上传") {
        //     sta == "未上传";
        //   } else {
        //     sta == "已上传";
        //   }

        // } else {
        //   sta == "已上传";
        // }
        // if (sta == "未上传") {

        //} else {
        if (res.confirm) {
          wx.request({
            url: url + '/survey/audio/' + audios[index].id,
            "method": "DELETE",
            header: {
              "content-type": "application/json",
              "authorization": da.data.sessionId
            },
            success: (res) => {
              console.log("删除录音返回")
              console.log(res.data)
              if (res.data.status == true) {

              }
              wx.showToast({
                title: '删除录音成功',
                duration: 3000
              })
            }

          })
          audios.splice(index, 1);

          that.setData({
            audios_list: audios
          })
        }else{
          console.log("取消不进行删除操作")
        }
       
      }
    })
  },
  uploadRecord: function (e) { //上传录音
    console.log("上传录音")
    console.log(e.detail.value)
    var that = this;
    var formObject = e.detail.value;
    console.log(formObject.path)
    var len = record_array.length
    for (var i = 0; i < len; i++) { //遍历录音列表，上传录音
      //var index = i;
      var record_name = record_array[0].name;
      var savedFilePath = "";
      if (record_array[0].record_status == "未上传") {
        wx.saveFile({ //上传前把临时文件转正式文件
          tempFilePath: record_array[0].path,
          success(res) {
            savedFilePath = res.savedFilePath
            console.log("savedFilePath:" + savedFilePath)
            const fileSystemManager = wx.getFileSystemManager()
            fileSystemManager.rename({ //重命名正式文件
              oldPath: savedFilePath,
              newPath: wx.env.USER_DATA_PATH + "/" + record_name + ".mp3",
              success: function (res) {
                console.log("sss:" + res.errMsg)
                wx.uploadFile({ //发送上传请求
                  url: url + '/survey/' + taskId + '/audio/' + record_name + '/1?lastIndex=1',
                  filePath: wx.env.USER_DATA_PATH + "/" + record_name + ".mp3",
                  name: "file",
                  header: {
                    "content-type": "multipart/form-data",
                    "authorization": da.data.sessionId
                  },
                  success: function (res) {
                    console.log("上传成功")
                    console.log(res.data)
                    //console.log(res.data.status)
                    var new_data = JSON.parse(res.data)
                    console.log(new_data.status)
                    if (new_data.status == true) {
                      // console.log(index)
                      console.log(record_array[0].name)
                      var newA = {
                        "name": record_name,
                        "path": wx.env.USER_DATA_PATH + "/" + record_name + ".mp3",
                        "record_status": "已上传",
                        "id": new_data.data
                      }
                      audios.push(newA)
                      record_array.splice(0, 1)
                      that.setData({
                        audios_list: audios,
                        record_list: record_array
                      })
                      //record_array.splice(i-1, 1, newA)
                      console.log(audios)
                      console.log(record_array)

                    }
                  },
                  fail: (res) => {
                    console.log("上传失败")
                    console.log(res.data)
                  }
                })
              },
              fail: function (res) {
                console.log("fff" + res.errMsg)
              }
            })
          }
        })
      }
    }
    wx.showToast({
      title: '上传成功',
      success: () => {
        console.log("流量")
        //  console.log(record_array)

      }
    })

  },
  playRecord: function(e) { //播放录音
    // wx.createSelectorQuery().select('#path').fields({
    //   dataset: true,
    //   size: true,
    //   scrollOffset: true,
    //   properties: ['value'],
    //   computedStyle: ['margin', 'backgroundColor'],
    //   context: true,
    // }, function(res) {
    //   console.log(res.value)
    //   res.dataset // 节点的dataset
    //   res.width // 节点的宽度
    //   res.height // 节点的高度
    //   res.scrollLeft // 节点的水平滚动位置
    //   res.scrollTop // 节点的竖直滚动位置
    //   res.scrollX // 节点 scroll-x 属性的当前值
    //   res.scrollY // 节点 scroll-y 属性的当前值
    //   // 此处返回指定要返回的样式名
    //   res.margin
    //   res.backgroundColor
    //   res.context // 节点对应的 Context 对象
    // }).exec()
    this.innerAudioContext.autoplay = true
    this.innerAudioContext.src ="http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46"
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    this.innerAudioContext.onTimeUpdate(function(e){
     
      console.log(e)

    })
    InnerAudioContext.onStop(function(){
      console.log("停止播放")

    })

    // this.innerAudioContext.offPlay((res) => {
    //   console.log("取消播放")
    // })
  },
  changeTap: function(e) { //点击切换界面
    console.log(e.currentTarget.id);
    var id = e.currentTarget.id;

    switch (id) {
      case "map":
        console.log("切换到地图")
        var array = {
          "status_map": false
        }
        this.setData({
          tap_status: array
        })
        break;
      case "pic":
        console.log("切换到图片")
        var array = {
          "status_pic": false
        }
        this.setData({
          tap_status: array
        })
        break
      case "con":
        var array = {
          "status_con": false
        }
        this.setData({
          tap_status: array
        })
        break
      case "rec":
        var array = {
          "status_rec": false
        }
        this.setData({
          tap_status: array
        })
        break
      case "sur":
        var array = {
          "status_sur": false
        }
        this.setData({
          tap_status: array
        })
        break
      case "appr":
        var array = {
          "status_appr": false
        }
        this.setData({
          tap_status: array
        })
        break
    }

  },
  submitRur: function(e) { //提交调查报告
    console.log("表单提交")
    // var url = app.serverUrl;
    // var da = app.getGlobalUserInfo();
    var formObject = e.detail.value;
    var textarea = formObject.textarea;
    console.log("ssds:" + textarea)
    //发送提交请求
    wx.request({
      url: url + '/survey/commit/task/' + taskId,
      method: "POST",
      data: {
        "comment": textarea
      },
      header: {
        "content-type": "application/json",
        "authorization": da.data.sessionId
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.status == true) {
          wx.showToast({
            title: "提交成功",
            duration: 3000
          })
        } else {
          wx.showToast({
            title: res.data.error.message,
          })
        }
      },
      fail: function(res) {
        console.log(res.data)
      }

    })
  },
  goApproval: function() { //获取审批报告

    wx.downloadFile({
      // 
      url: url + '/survey/core/task/iaf/report/' + taskId,
      success(res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType: "xls",
          success(res) {
            console.log(res)
            console.log('打开文档成功')
          }
        })
      }
    })
  }

})