var app=getApp()
Page({
 
  data: {
  show:false,//控制下拉列表的显示隐藏，false隐藏、true显示
  selectData:['站着搜','躺着搜','趴着搜','坐着搜'],//下拉列表的数据
  index:0//选择的下拉列表下标
  },

  // 点击下拉显示框
  selectTap(){
  this.setData({
   show: !this.data.show
  });
  },
  // 点击下拉列表
  optionTap(e){
  let Index=e.currentTarget.dataset.index;//获取点击的下拉列表的下标
  app.globalData.id=Index
  this.setData({
   index:Index,
   show:!this.data.show
  });
  },
  
 })