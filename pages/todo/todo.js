// miniprogram/pages/todo/todo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vital_num:'',
    task_num:'',
    done_num:'',
    all_num:'',
  },
  next:function(e){
    var type;
    type = e.currentTarget.dataset.type;
    if(type=="task")
    {
      wx.redirectTo({
        url: '../task/task',
      })
    }
    else if(type=="vital"){
      wx.redirectTo({
        url: '../task/vital',
      })

    }
    else if(type=="done"){
      wx.redirectTo({
        url: '../task/done',
      })
    }
  },
  newadd:function(e){
    wx.redirectTo({
      url: './newlist',
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 云函数登录
      wx.cloud.callFunction({
        name: 'login',
        data: {}
      })
        .then(res => {
          // 登陆成功之后保存至app.globalData
          app.globalData.openid = res.result.openid
          // return的值被下一个.then函数接收
          // return res.result.openid
        })

      const db = wx.cloud.database();
      db.collection('todos').where({
        _openid: this.data.openid,
        type:1 || 2,
      })
        .orderBy('gmtCreate', 'desc')
        .count()
        .then(
          res=>{
            this.setData({
              task_num:res.total
            })
          }
        )
      db.collection('todos').where({
      _openid: this.data.openid,
      type: 0,
      })
      .orderBy('gmtCreate', 'desc')
      .count()
      .then(
        res => {
          this.setData({
            done_num: res.total
          })
        }
      )
      db.collection('todos').where({
        _openid: this.data.openid,
        collected: 1,
        type:1||2,
      })
        .orderBy('gmtCreate', 'desc')
        .count()
        .then(
          res => {
            this.setData({
              vital_num: res.total
            })
          }
        )
        // .get({
        //   success: res => {
        //     this.setData({
        //       todos: res.data
        //     })
        //     var mytodos = this.data.todos;
        //     var vital_num = 0,task_num =0,done_num = 0;
        //     for(var i = 0; i < mytodos.length;i++)
        //     {
        //       if(mytodos[i].type==0)
        //       {
        //         done_num = done_num + 1;
        //       }
        //       else if(mytodos[i].type==1){
        //         task_num = task_num + 1;
        //       }
        //       else if(mytodos[i].collected ==1){
        //         vital_num = vital_num + 1;
        //       }
        //     }
        //     this.setData({
        //       task_num:task_num,
        //       vital_num:vital_num,
        //       done_num:done_num
        //     })
        //     console.log(done_num)
        //     console.log(mytodos)

      //     },
      //     fail: err => {
      //       wx.showToast({
      //         title: 'Error!',
      //       })
      //     }
        
      // })
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