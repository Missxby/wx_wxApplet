const app = getApp()
Page({
  data: {
    kinds: [],
    listData: [],
    bannerId: '',
    page: 0,
    active: 0,
    totalPage: 1,
    index: 0,
    name: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option){
    this.getKinds()
  },
  getKinds:function(){
    wx.request({
      url: app.hostUrl +'/lecturer/classRoom/typeList',
      data:{
        isShow: 0
      },
      method:"GET",
      success: (res) => {
        console.log(res)
        if(res.data.code == 0){
            this.setData({
              kinds: res.data.data,
              name: res.data.data[0].name
            })
            this.data.bannerId = res.data.data[0].id
            this.getList()
        } 
      }
    })
  },
  getList: function (id){
    this.data.page++
    if (this.data.page > this.data.totalPage){
      return false
    }
    wx.request({
      url: app.hostUrl+'/lecturer/classRoom/getInformationInfo',
      data:{
        page: this.data.page,
        typeId:this.data.bannerId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success : (res) => {
      if (res.data.code == 0){
          if(this.data.bannerId == 100 ){
            res.data.data.vieoList.map((value, key, arr) =>{
              res.data.data.vieoList[key].createTime = res.data.data.vieoList[key].createTime.split(' ')[0]
              this.setData({
                listData: res.data.data.vieoList
              })
            })
          }else{
            res.data.data.baseList.map((value, key, arr) => {
              res.data.data.baseList[key].createTime = res.data.data.baseList[key].createTime && res.data.data.baseList [key].createTime.split(' ')[0]
            })
            this.setData({
              listData: res.data.data.baseList
            })
          }
        }
      }

    })
  } 
})
