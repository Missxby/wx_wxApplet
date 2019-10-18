const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '栏目',
    active1: false,
    active2: false,
    bannerId: '',
    page: 0,
    totalPage: 1,
    kinds: [],
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getKinds()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changeState: function (e) {
    this.data.active1 = !this.data.active1
    this.setData({
      active1: this.data.active1
    })
  },
  changeLabel: function (e) {
    var id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.name
    this.data.page = 0
    this.data.bannerId = id
    this.getList()
    this.setData({
      active1: false,
      title: title
    })
    console.log(id)
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
        typeId: 104
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == 0) {
          this.data.bannerId = res.data.data.typeList[0].id
          this.setData({
            kinds: res.data.data.typeList
          })
          this.getList()
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
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: (res) => {
        if (res.data.code == 0) {
          if (res.data.data.totalPage > 0) {
            this.data.totalPage = res.data.data.totalPage
          }
          res.data.data.rows.map((value, key, arr) => {
            res.data.data.rows[key].createTime = res.data.data.rows[key].createTime.split(' ')[0]
          })
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