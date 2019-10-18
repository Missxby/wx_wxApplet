const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    page: 0,
    audioCtx: '',
    totalPage: 1,
    index: 0,
    name: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(options.id)
    this.data.audioCtx = wx.createInnerAudioContext()
    this.audioUpdate()
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
  getList: function (id) {
    this.data.page++
    if (this.data.page > this.data.totalPage) {
      return false
    }
    wx.request({
      url: app.hostUrl + '/lecturer/classRoom/audioList',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": ''
      },
      data: {
        baseId: id,
        type:2
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == 0) {
          if (res.data.data.totalPage > 0) {
            this.data.totalPage = res.data.data.totalPage
          }
          for (let i = 0; i < res.data.data.list.length; i++) {
            res.data.data.list[i].flag = true
            res.data.data.list[i].currentTime = '00:00:00'
            res.data.data.list[i].createTime = res.data.data.list[i].createTime.split(' ')[0]
          }
          this.setData({
            listData: res.data.data.list,
            name: res.data.data.name
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.data.audioCtx.pause()
    for (let i = 0; i < this.data.listData.length; i++) {
      this.data.listData[i].flag = true
    }
    this.setData({
      listData: this.data.listData
    })
  },
  changeState: function (e) {
    let index = e.currentTarget.dataset.index
    this.data.index = e.currentTarget.dataset.index
    this.data.audioCtx.src = this.data.listData[index].audioUrl
    for (let i = 0; i < this.data.listData.length; i++) {
      if (i !== index) {
        this.data.listData[i].flag = true
        this.data.listData[i].currentTime = '00:00:00'
      }
    }
    this.data.listData[index].flag = !this.data.listData[index].flag
    if (this.data.listData[index].flag) {
      this.data.audioCtx.pause()
    } else {
      this.data.audioCtx.play()
    }
    this.setData({
      listData: this.data.listData
    })
  },
  audioUpdate: function () {
    this.data.audioCtx.onTimeUpdate((value) => {
      this.data.listData[this.data.index].currentTime = this.timeToMinute(parseInt(this.data.audioCtx.currentTime))
      this.setData({
        listData: this.data.listData
      })
    })
  },
  timeToMinute: function (times) {
    var result = '00:00:00';
    var hour, minute, second
    if (times > 0) {
      hour = Math.floor(times / 3600);
      if (hour < 10) {
        hour = "0" + hour;
      }
      minute = Math.floor((times - 3600 * hour) / 60);
      if (minute < 10) {
        minute = "0" + minute;
      }
      second = Math.floor((times - 3600 * hour - 60 * minute) % 60);
      if (second < 10) {
        second = "0" + second;
      }
      if (hour == '00') {
        result = '00:' + minute + ':' + second;
      } else if (minute == '00') {
        result = hour + ':' + minute + ':' + second;
      } else {
        result = second;
      }
    }
    return result
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.audioCtx.pause()
    for (let i = 0; i < this.data.listData.length; i++) {
      this.data.listData[i].flag = true
      this.data.listData[i].currentTime = '00:00:00'
    }
    this.setData({
      listData: this.data.listData
    })
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
    this.getList()
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})