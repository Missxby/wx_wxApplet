const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    listData: [],
    active: 0,
    videoSrc: '',
    videoContext: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id)
    this.data.videoContext = wx.createVideoContext('myVideo')  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  getData: function (id) {
    wx.request({
      url: app.hostUrl + '/lecturer/classRoom/audioList',
      data: {
        baseId: id,
        type: 1,
        token: ''
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": ''
      },
      method: 'POST',
      success: (res) => {
        if (res.data.code == 0) {
          this.setData({
            videoSrc: res.data.data.audioUrl,
            detailData: res.data.data,
            listData: res.data.data.list
          })
          setTimeout(() => {
            this.data.videoContext.play()
          }, 1)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  changeVideo: function (e) {
    this.data.videoContext.pause()
    console.log(this.data.listData[e.target.dataset.index].audioUrl)
    this.setData({
      active: e.target.dataset.index,
      videoSrc: this.data.listData[e.target.dataset.index].audioUrl
    })
    setTimeout(() => {
      this.data.videoContext.play()
    }, 1)
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