const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kinds: [],
    active: 0,
    listData: [],
    page: 0,
    bannerId: '',
    totalPage: 1
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
  chooseItem: function (data) {
    let active = data.currentTarget.dataset.index
    this.data.bannerId = data.currentTarget.dataset.id
    this.data.page = 0
    this.data.listData = []
    this.getList()
    this.setData({
      active: active
    })
  },
  getKinds: function () {
    wx.request({
      url: app.hostUrl + '/lecturer/classRoom/getOneTypeInfo',
      data: {
        typeId: 106
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 0) {
          if (!res.data.data.hasOwnProperty()) {
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
          } else {
            this.data.bannerId = res.data.data.typeList[0].id
            this.setData({
              kinds: res.data.data.typeList
            })
            this.getList()
          }
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
          res.data.data.rows.map((value, key, arr) => {
            res.data.data.rows[key].createTime = res.data.data.rows[key].createTime.split(" ")[0]
          })
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
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})