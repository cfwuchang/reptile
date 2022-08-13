// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env:'pan-4gym5b4rffd78434'
    })
  },
  watch: function (method) {
    var obj = this.globalData;
    Object.defineProperty(obj, "id", { //这里的 data 对应 上面 globalData 中的 data
    configurable: true,
    enumerable: true,
    set: function (value) { //动态赋值，传递对象，为 globalData 中对应变量赋值
    this._id=value
    method(value);
    },
    get: function (value) { //获取全局变量值，直接返回全部
      
    }
    })
    },
  globalData: {
    id:0,
    _id:0
  }
})