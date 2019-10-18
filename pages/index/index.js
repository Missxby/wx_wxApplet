//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    bannerData: [],
    kindsData: [],
    list: [],
    page: 0,
    totalPage: 1
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  errorfn: function (index) {
    this.list[index].imgUrl = '../../images/common/moren.png'
  },
  onLoad: function () {
    this.getBanner()
    this.getList(this.data.page)
    this.getKinds()
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  getBanner: function () {
    wx.request({
      url: app.hostUrl + '/lecturer/classRoom/getHomeInfo',
      data: {
        type: 2
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        if (res.data.code == 0) {
          this.setData({
            bannerData: res.data.data
          })
          console.log(typeof res.data.data)
        }
      }
    })
  },
  getKinds: function () {
    wx.request({
      url: app.hostUrl + '/lecturer/classRoom/typeList',
      data: {
        isShow: 1
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == 0) {
          this.kindsData = []
          for (let i = 0; i < res.data.data.length; i++) {
            this.kindsData.push(res.data.data[i])
          }
          this.setData({
            kindsData: this.kindsData
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
      url: app.hostUrl + '/lecturer/classRoom/getHomeList',
      data: {
        page: this.data.page,
        typeId: ''
      },
      method: 'GET',
      success: (res) => {
        if (res.data.code == 0) {
          this.data.totalPage = res.data.data.totalPage
          for (let i = 0; i < res.data.data.rows.length; i++) {
            const createTime = res.data.data.rows[i].createTime
            res.data.data.rows[i].createTime = createTime && createTime.split(' ')[0]
            this.data.list.push(res.data.data.rows[i])
          }
          this.setData({
            list: this.data.list
          })
        }
      }
    })
  },
  onReachBottom: function () {
    this.getList()
  },
  getUserInfo: function (e) {
    // console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
  }
})
