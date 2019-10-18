const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    isShow: 1,
    itemActive: "0",
    state: '',
    bannerId: '',
    kinds: [],
    videoSrc: '',
    videoContext: '',
    data: [],
    contenActive: 'ww',
    urlName: '',
    flag: true,
  },
  chooseItem: function (data) {
    // let active = data.currentTarget.dataset.index
    this.data.bannerId = data.currentTarget.dataset.id
    let index = data.currentTarget.dataset.index
    this.data.page = 0
    this.data.data = []
    this.setData({
      isShow: 2,
      contenActive: index
    })
    this.getList()
  },
  closeList() {
    this.setData({
      isShow: 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.hasOwnProperty()) {
      wx.showToast({
        title: '暂无数据',
        success(res) {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1000)
        }
      })
      return
    }
    this.data.name = options.title
    this.data.urlName = options.title
    this.data.state = options.already
    this.data.videoSrc = options.videUrl
    this.getKinds()
    this.data.videoContext = wx.createVideoContext('myVideo')
  },
  getKinds: function () {
    wx.request({
      url: app.hostUrl + '/lecturer/classRoom/getOneTypeInfo',
      data: {
        typeId: 100
      },
      method: 'GET',
      success: (res) => {
        console.log(res)
        if (res.data.code == 0) {
          this.data.bannerId = res.data.data.typeList[0].id
          // this.getBanner()
          this.getList()
          this.setData({
            kinds: res.data.data.typeList
          })
        }
      }
    })
  },
  getList: function () {
    wx.request({
      url: app.hostUrl + '/lecturer/classRoom/getTwoTypeInfo',
      data: {
        page: 100,
        typeIdTwo: this.data.bannerId
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data)
        console.log(res.data)
        if (res.data.code == 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            const startTime = res.data.data[i].startTime
            // res.data.data[i].startTime = startTime && startTime.split(" ")[1]
          }
          if (this.data.urlName) {
            this.setData({
              name: this.data.name,
              state: this.data.state,
              itemActive: "0",
              videoSrc: this.data.videoSrc
            })
            setTimeout(() => {
              this.data.videoContext.play()
            }, 500)
            this.data.urlName = ''
            return false
          }
          setTimeout(() => {
            if (this.data.contenActive == 0 && this.data.flag) {
              this.data.flag = false
            } else {
              this.data.videoContext.seek(0)
            }
            this.data.videoContext.play()
          }, 500)
          this.setData({
            data: res.data.data,
            name: res.data.data[0].title,
            state: res.data.data[0].already,
            itemActive: "0",
            videoSrc: res.data.data[0].videUrl
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  chooseVideo: function (data) {
    let url = data.currentTarget.dataset.url
    let title = data.currentTarget.dataset.title
    let type = data.currentTarget.dataset.already
    let index = data.currentTarget.dataset.index
    this.setData({
      itemActive: index,
      name: title,
      state: type,
      videoSrc: url
    })
    setTimeout(() => {
      this.data.videoContext.seek(0)
      this.data.videoContext.play()
    }, 1)
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