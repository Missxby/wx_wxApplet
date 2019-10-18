// pages/choiceness/choiceness.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBackgroundOne: false,
    tabBackgroundTwo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  change (obj) {
    let num = obj.currentTarget.dataset.num
    if (num == 1) {
      this.data.tabBackgroundOne = !this.data.tabBackgroundOne;
    } else {
      this.data.tabBackgroundTwo = !this.data.tabBackgroundTwo;
    }
    this.setData({
      tabBackgroundOne: this.data.tabBackgroundOne,
      tabBackgroundTwo: this.data.tabBackgroundTwo
    })
  },
  // 获取标签下的列表
  
})