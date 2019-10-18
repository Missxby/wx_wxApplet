const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:{
      imgUrl: '',
      title: '',
      des: ''
    },
    slider_value: 0,
    slider_max: 100,
    audioCtx: '',
    currentTime: '',
    totalTime: '',
    active: 0,
    isLoop: false,
    flag:false,
    listData: []
  },
  ranking: 0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.audioInt()
    this.getList(options.id, options.checkId)
    // this.getList(5)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  audioInt: function () {
    this.data.audioCtx = wx.createInnerAudioContext()
    this.data.audioCtx.src = ''
    this.audioUpdate()
    this.playEnd()
  },
  getList: function (id,checkId) {
    wx.request({
      url: app.hostUrl + '/lecturer/classRoom/audioList',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": ''
      },
      data: {
        baseId: id,
        type: 2,
        token: ''
      },
      method: 'POST',
      success: (res) => {
        if (res.data.code == 0) {
          let number = 0;
          for (let i = 0; i < res.data.data.list.length;i++) {
            if (res.data.data.list[i].id == checkId) {
              number = i
            }
          }
          this.ranking = number
          this.data.audioCtx.src = res.data.data.list[number].audioUrl
          this.data.content.name = res.data.data.list[number].title
          this.data.content.des = res.data.data.list[number].author
          this.data.content.imgUrl = res.data.data.list[number].imgUrl
          this.data.audioCtx.play()
          this.data.audioCtx.onPlay((e) => {
            this.data.audioCtx.duration //类似初始化-必须触发-不触发此函数延时也获取不到
            setTimeout(()=>{
              this.setData({
                totalTime: this.timeToMinute(parseInt(this.data.audioCtx.duration)),
                listData: res.data.data.list,
                content: this.data.content
              })
            },1000)
          })
        }
      }
    })
  },
  playPre: function () {
    if (this.data.listData.length < 2) {
      return false
    }
    this.ranking--;
    if (this.ranking < 0) {
      this.ranking = this.data.listData.length - 1
    }
    console.log(this.ranking)
    this.playCommon(this.ranking)
  },
  playNext: function () {
    if (this.data.listData.length < 2) {
      this.data.audioCtx.play()
      return false
    }
    this.ranking = 1 + this.ranking;
    if (this.ranking == this.data.listData.length) {
      this.ranking = 0
    }
    this.playCommon(this.ranking)
  },
  playCommon: function (number) {
    this.data.audioCtx.src = this.data.listData[number].audioUrl
    this.data.content.name = this.data.listData[number].title
    this.data.content.des = this.data.listData[number].author
    this.data.content.imgUrl = this.data.listData[number].imgUrl
    this.data.audioCtx.play()
    this.data.audioCtx.onPlay((e) => {
      this.data.audioCtx.duration //类似初始化-必须触发-不触发此函数延时也获取不到
      setTimeout(() => {
        this.setData({
          totalTime: this.timeToMinute(parseInt(this.data.audioCtx.duration)),
          content: this.data.content
        })
      }, 1000)
    })
  },
  playEnd: function () {
    this.data.audioCtx.onEnded(() => {
      if (this.data.isLoop) {
        this.data.audioCtx.seek(0)
        this.data.audioCtx.play()
      } else {
        this.playNext()
      }
    })
  }, 
  changLoopState: function () {
    if (this.data.isLoop) {
      this.setData({
        isLoop: false,
      })
    } else {
      this.setData({
        isLoop: true,
      })
    }
  },
  changeAudio: function () {
    if (this.data.active == 0) {
      this.data.active = 1
      this.data.audioCtx.pause()
    } else {
      this.data.active = 0
      this.data.audioCtx.play()
    }
    this.setData({
      active: this.data.active,
    })
  },
  audioUpdate: function () {
    this.data.audioCtx.onTimeUpdate((value) => {
      if (this.data.flag) {
        return false
      }
      this.data.slider_value = this.data.audioCtx.currentTime / this.data.audioCtx.duration * 100
      this.setData({
        currentTime: this.timeToMinute(parseInt(this.data.audioCtx.currentTime)),
        totalTime: this.timeToMinute(parseInt(this.data.audioCtx.duration)),
        slider_value: this.data.slider_value
      })
    })
  },
  sliderChange: function (value) {
    this.data.audioCtx.seek(value.detail.value / 100 * this.data.audioCtx.duration)
    // this.audioCtx.play()
    setTimeout(() => {
      this.data.flag = false
    }, 200)
  },
  changeState: function () {
    this.data.flag = true
  }, 
  timeToMinute: function (times) {
    var result = '00:00';
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
        result = minute + ':' + second;
      } else if (minute == '00') {
        result = hour + ':' + minute + ':' + second;
      } else {
        result = second;
      }
    }
    return result
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
    this.data.audioCtx.pause()
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
