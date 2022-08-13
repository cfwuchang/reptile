// pages/listCom/listCom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindfocus: false,
    input: '',
    url:'',
    title:'',
    lists:[],
    user:'',
    id:0,
    value:'',
    page:0,
    com:{}
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      "url": options.url,
      'title':options.title,
      'value':options.value,
      'index':options.index,
      'page':options.page,
      'id':getApp().globalData._id,
    }),
    wx.cloud.callFunction({
      name:'users',
      data:{
        $url:'getlogin'
      }
    }).then(r=>{
      // console.log(r);
      this.setData({
        'user':r.result.data[0]
      })
    }).catch(err=>{
      console.log(err);
    })
    if(this.data.id==0){
    this.details(options.url)
      this.associate(options.title)
    }else if(this.data.id==1){
    this.details(options.url)
      this.associate(options.value)
    }else if(this.data.id==2){
    this.details(options.url)
      this.associate(options.value)
    }else if(this.data.id==3){
      if(options.surl!=undefined){
        var aa='surl='+options.surl+"&v="+options.v
      this.details(aa)
      this.associate(aa)

      // this.listsHandler()
      }else if(options.uid && options.sid){
      var aa='uid'+options.uid+"&sid="+options.sid+'&v='+options.v
      this.details(aa)
      // this.listsHandler()
      this.associate(aa)


    }
    }
  },
  // 点击复制链接
  urlHandler(e){
    // console.log(e.currentTarget.dataset.title);
    console.log(e);
    wx.setClipboardData({
      data: e.currentTarget.dataset.title,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  // 点击联想按钮
  listHandler(e){
    console.log(e);
    if(this.data.id==0){
      console.log(e.currentTarget.dataset.title);
      this.details(e.currentTarget.dataset.url)
      this.associate(e.currentTarget.dataset.title)
    }else if(this.data.id==1){
      wx.redirectTo({
        url: '/pages/list/list?value='+e.currentTarget.dataset.title,
      })
    }else if(this.data.id==3){
      wx.redirectTo({
        url: '/pages/listCom/listCom?'+e.currentTarget.dataset.url,
      })
    }
    
  },
  //点击复制提取码
  keyHandler(e){
    // console.log(e.currentTarget.dataset.title);
    wx.setClipboardData({
      data: e.currentTarget.dataset.key,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  bindfocus(e) {
    this.setData({
      'bindfocus': true
    })
  },
  bindblur(e) {
    console.log(e);
    this.setData({
      'bindfocus': false,
      'input':e.detail.value
    })
    
  },
  bindconfirm(e) {
    console.log(e.detail.value);
    console.log(this.data.input);
    if (e.detail.value == undefined) {
      wx.redirectTo({
        url: '/pages/list/list?value='+this.data.input,
      })

    } else {
      wx.redirectTo({
        url: '/pages/list/list?value='+e.detail.value,
      })
    }
    this.setData({
      'input': ''
    })
  },
  // 详情
  details(url){
    if(url.indexOf('http://www.kengso.com/')!=-1){
      var a1=url.indexOf('file/')
      var a2=url.indexOf('.html')
      var bb=url.substring(a1+5,a2)
      console.log(bb)
      var cc=`http://share.panmeme.com/share/get?urlmd5=${bb}`
      console.log(cc)
      wx.cloud.callFunction({
        name:'pan',
        data:{
          $url:'com1',
          url:cc
        }
      }).then((r=>{
        console.log(r.result);
        var cc=JSON.parse(r.result)
        console.log(cc)
        var aaa={}
        aaa.url=cc.data.url
        aaa.con=`链接：${cc.data.url}，提取码：${cc.data.password}，解压码：${cc.data.unzippwd}`
        
        if(cc.data.password!=''){
          aaa.key=cc.data.password
        }
        this.setData({
          'com':aaa
        })
      })).catch((err=>{
        console.log(err);
      }))
    } else if(url.indexOf('/file')!=-1){
      console.log(url);
      var urls=url
      url=url.slice(0,5)+'?id='+url.slice(6)
      console.log(url)
        wx.cloud.callFunction({
          name:'pan',
          data:{
            $url:'com2',
            url:url,
            urls:urls
          }
          
        }).then((r)=>{
          console.log(r.result);
          var aaa={}
          aaa.url=r.result.url
          aaa.con=`链接：${r.result.url},${r.result.text}`
          
          if(r.result.text!=''){
            aaa.key=r.result.text.substring(r.result.text.indexOf("：")+1,r.result.text.length)
          }
          this.setData({
            'com':aaa
          })
        }).catch((err)=>{
          console.log(err);
        })
    } else if (url.indexOf('surl')!=-1){
      console.log(url);
     wx.cloud.callFunction({
       name:'pan',
       data:{
         $url:'com3',
         url:url
       }
     }).then(r=>{
       console.log(r);
       console.log(r.result.index);
       console.log(url);
       wx.cloud.callFunction({
        name:'pan',
        data:{
          $url:'com3Url',
          index:r.result.index,
          url:url
        }
      }).then(res=>{
        console.log(JSON.parse(res.result));
        var aa=JSON.parse(res.result)
        this.data.com.title=r.result.con
        this.data.com.con='链接：https://pan.baidu.com'+aa.url
        this.data.com.url=`https://pan.baidu.com${aa.url}`
          this.setData({
            com:this.data.com,
          })
      })
     })
    }else if (url.indexOf('uid')!=-1){
      wx.cloud.callFunction({
        name:'pan',
        data:{
          $url:'com3',
          url:url
        }
      }).then(r=>{
        console.log(r);
        
        wx.cloud.callFunction({
          name:'pan',
          data:{
            $url:'com3Url',
            index:r.result.index,
            url:url
          }
        }).then(res=>{
          console.log(JSON.parse(res.result));
          var aa=JSON.parse(res.result)
          this.data.com.title=r.result.con
          this.data.com.con='链接：https://pan.baidu.com'+aa.url
          this.data.com.url=`https://pan.baidu.com${aa.url}`
          this.setData({
            com:this.data.com,
          })
          
        })
      })
    }else{
      console.log(url);
      wx.cloud.callFunction({
        name:'pan',
        data:{
          $url:'com',
          url:url
        }
      }).then(r=>{
        console.log(r);
      var aaa={}
      var a=r.result.con
      var ma=r.result.ma
      if(r.result.url){
        aaa.url=r.result.url
      }else{
        var a1= a.indexOf('http')
      var a2=  a.substring(a1,a.length).indexOf(' ')
        console.log(a2);
        if(a2!=-1){
          aaa.url=a.substring(a1,a.length).substring(0,a2)
        }else{
          aaa.url=a
        }
      }
        aaa.con=r.result.con
        var cc=[]
        var b=r.result.headline
        var b1=b.indexOf('资源内容：')
        var b2=b.substring(0,b1)
        var arr=b2.split(/[ ]+/)
        for (let i = 0; i < arr.length; i++) {
          if(arr[i].length!=2 && i!=0){
            arr[i]=arr[i].substring(0, arr[i].length - 1);
            cc.push(arr[i])
          }
        }
        console.log(cc);
        aaa.title=cc
        var c1=a.indexOf('码')
        console.log(c1);
        if(c1!=-1){
          if(a.substring(c1+2,c1+7).replace(/^\s+|\s+$/gm, '').length>4){
            aaa.key= a.substring(c1+2,c1+7).replace(/^\s+|\s+$/gm, '').substring(0,4)
          }else{
            aaa.key=a.substring(c1+2,c1+7).replace(/^\s+|\s+$/gm, '')
          }
        }else if(ma.indexOf('备注：')!=-1){
          if(ma.substring(ma.indexOf('备注：'),ma.length).length>4){
            aaa.key=ma.substring(ma.indexOf('备注：')+3,ma.length).substring(0,4)
          }else{
            aaa.key=ma.substring(ma.indexOf('备注：'),ma.length)
          }
        }
        console.log(aaa);
        this.setData({
          'com':aaa
        })
      }).catch(err=>{
        console.log(err);
      })
    }
    
  },
  // 联想
  associate(title){
    if(this.data.id==0){
      wx.cloud.callFunction({
        name:'pan',
        data:{
          $url:'related',
          q:title
        }
      }).then(r=>{
        console.log(r);
        var lists=[]
        for (let i = 0; i < r.result.length; i++) {
          var aa={}
          aa.title=r.result[i].name
          aa.url='/article/'+r.result[i].id
          lists.push(aa)
        }
        this.setData({
          'lists':lists
        })
      }).catch(err=>{
        console.log(err);
      })
    }else if(this.data.id==1){
      wx.cloud.callFunction({
        name:'pan',
        data:{
          $url:'related1',
          value:title
        }
      }).then((r)=>{
        var lists=[]
        for (let i = 0; i < r.result.r.length; i++) {
          var aa={}
          aa.title=r.result.r[i].w
          lists.push(aa)
        }
        this.setData({
          'lists':lists
        })
      }).catch((err)=>{
        console.log(err);
      })
    }else if(this.data.id==2){
      var lists=[]
      var aa={}
      aa.title='聯想不到，返回上一頁搜索吧'
      lists.push(aa)
      this.setData({
        'lists':lists
      })
    }else if(this.data.id==3){
      wx.cloud.callFunction({
        name:'pan',
        data:{
          $url:'related3',
          url:title
        }
      }).then(r=>{
        console.log(r);
        for (let i = 0; i < r.result.length; i++) {
          r.result[i].url=r.result[i].url.substring(r.result[i].url.indexOf('?')+1,r.result[i].url.length)
        }
        this.setData({
          'lists':r.result
        })
      })
    }
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

  }
})