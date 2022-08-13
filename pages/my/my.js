// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  user:{},
  bool:true,
  switch:{
    one:false,
    two:true,
    three:true
  }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:'users',
      data:{
        $url:'getlogin'
      }
    }).then(res=>{
      var that=this
      if(res.result.data.length==0){
        var aa={}
        wx.getUserInfo({
          success(res){
            aa.avatarUrl=res.userInfo.avatarUrl,
            aa.nickName=res.userInfo.nickName+'（点击头像授权）'
            that.setData({
              'user':aa
            })
          }
        })
      }else{
        var aa={}
        aa.avatarUrl=res.result.data[0].avatarUrl
        aa.nickName=res.result.data[0].nickName
        aa.openid=res.result.data[0].openid
        aa.switch=res.result.data[0].switch
        aa.history=res.result.data[0].history
        that.setData({
          'user':aa,
          'bool':false
        })
      }
    })
  },
  buttomHandler(e){ 
    var that=this
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success:(res)=>{
        wx.cloud.callFunction({
              name:'users',
              data:{
                $url:'newUser',
                nickName:res.userInfo.nickName,
                gender:res.userInfo.gender,
                avatarUrl:res.userInfo.avatarUrl,
                province:res.userInfo.province+' '+res.userInfo.city,
                switch:that.data.switch
              }
            }).then(r=>{
              console.log(r);
              if(r.result.errMsg=="collection.add:ok"){
                that.onLoad()
              }
            }).catch(err=>{
              console.log(err);
            })
      }
    })
  },
  buttonHandler(e){
    wx.cloud.callFunction({
      name:'users',
      data:{
        $url:'uphistory',
        openid:this.data.user.openid,
      }
    }).then(r=>{
      if(r.result.stats.updated==1){
        this.onLoad()
        wx.showToast({
          title: '清除成功',
          icon: 'success',
          duration: 1000
        })
      }
    }).catch(err=>{
      console.log(err);
    })
  },
  changeHandler(e){
    console.log(e);
    if(e.currentTarget.dataset.id=="one"){
      this.status(e.currentTarget.dataset.id,e.detail.value)
    }else if(e.currentTarget.dataset.id=="two"){
      this.status(e.currentTarget.dataset.id,e.detail.value)
    }else{
      this.status(e.currentTarget.dataset.id,e.detail.value)
    }
  },
  status(e,v){
    wx.cloud.callFunction({
      name:'users',
      data:{
        $url:'upuser',
        openid:this.data.user.openid,
        name:e,
        value:v
      }
    }).then(r=>{
      console.log(r);
    }).catch(err=>{
      console.log(err);
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
    return {
      title: '搜搜盘',
      desc: '帮助有需要的你！',
      path: '/pages/index/index'
    }
  }
})