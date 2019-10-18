const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    kinds:[],
    active: 0,
    bannerId: '',
    bannerList: [],
    listData: [],
    totalPage: 1,
    current: 0,
    page: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getKinds()
  },
  chooseItem: function (data) {
    let active = data.currentTarget.dataset.index
    this.data.bannerId = data.currentTarget.dataset.id
    this.data.page = 0
    this.data.listData = []
    this.getBanner()
    this.getList()
    this.setData({
      active: active,
      current: 0
    })
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
  getKinds: function () {
    wx.request({
      url: app.hostUrl + '/lecturer/classRoom/getOneTypeInfo',
      data: {
        typeId: 101
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == 0) {
          this.data.bannerId = res.data.data.typeList[0].id
          this.getBanner()
          this.getList()
          this.setData({
            kinds: res.data.data.typeList
          })
        }
      }
    })
  },
  getBanner: function () {
    wx.request({
      url: app.hostUrl + '/lecturer/classRoom/getTwoTypeImg',
      data: {
        typeIdTwo: this.data.bannerId
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == 0) {
          this.setData({
            bannerList: res.data.data
          })
        }
      }
    })
  },
  getList: function () {
    this.data.page++
    if (this.data.page > this.data.totalPage) {
      return false
    }
    wx.request({
      url: app.hostUrl + '/lecturer/classRoom/getTwoTypeInfo',
      data: {
        page: this.data.page,
        typeIdTwo: this.data.bannerId
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == 0) {
          if (res.data.data.totalPage > 0) {
            this.data.totalPage = res.data.data.totalPage
          }
          this.setData({
            listData: res.data.data.rows
          })
        }
      }
    })
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
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})