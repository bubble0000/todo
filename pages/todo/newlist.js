// miniprogram/pages/todo/newlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:'',
    deadline:'',
    remark:'',
    collected:0,
    mytask:'',
    myremark:'',
    modify:false,
    id:''


  },
  bindDateChange: function (e) {
    this.setData({
      deadline: e.detail.value
    })
  },
  bindInputChange:function(e){
    var type = e.currentTarget.dataset.type;
    if(type=="task"){
      this.setData({
        task:e.detail.value
      })
    
    }
    else if(type=="remark"){
      this.setData({
        remark:e.detail.value
      })

    }
    console.log("type",type);
    console.log("task",this.data.task);
    console.log("remark",this.data.remark)
  },
  
  addtodos:function(e){
    let that = this
    // 插入到数据库
    const db = wx.cloud.database()
    if(!this.data.modify)
    {
    db.collection('todos')
      .add({
        data: {
          mytask: that.data.task,
          due:that.data.deadline,
          myremark:that.data.remark,
          type: 1, //状态，0已完成，1待完成，2已逾期
          collected:this.data.collected, //收藏，0未收藏，1收藏
          gmtCreate: Date.parse(new Date()),
          delete:false
        }
      })
      .then(res => {
        wx.showToast({
          icon: 'none',
          title: '添加成功'
        })
        // 清空输入框
      })
      .catch(err => {
        console.error('写入失败', err)
      })
    }
    else{
      console.log(this.data.task)
      db.collection('todos').doc(this.data.id).update({
        data:{
          mytask:this.data.task==''?this.data.mytask:this.data.task,
          due:this.data.deadline,
          myremark:this.data.remark==''?this.data.myremark:this.data.remark
        },
        success:res=>{
          wx.showToast({
            title: '修改成功',
          })
        }
      })
    }
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type==0||1)
    {
    this.setData({
      collected:parseInt(options.type)

    })
    }
    if(options.mytask!=undefined){
      console.log(options.id)
      this.setData({
        mytask:options.mytask,
        deadline:options.due,
        myremark:options.myremark,
        id:options.id,
        modify:true
      })
    }
    console.log(options.due)

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