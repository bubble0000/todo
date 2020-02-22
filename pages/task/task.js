// miniprogram/task/task.js
var util = require('../../utils/dateutil.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    todos:'',
    status:true,
    startTime:'',
    endTime:'',
    task_length:true,
    date1:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.openid)
    {
      this.setData({
        openid:app.globalData.openid
      })
    }
    const db = wx.cloud.database()
    db.collection('todos').where({
      _openid:this.data.openid,
      type:1,
    })
     .orderBy('gmtCreate','desc')
     .get({
       success:res => {
         this.setData({
           todos:res.data,
           task_length:res.data.length>0?true:false,
           date1:util.formatTime(new Date())
         })
       console.log(this.data.task_length)
       console.log("date",this.data.date1)
       },
       fail:err => {
         wx.showToast({
           title: 'Error!',
         })
       }
     })

  },
  checkboxChange: function (e) {
    if (this.data.endTime - this.data.startTime < 350)
    {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);   
    var that = this;
    var checkboxItems = this.data.todos, values = e.detail.value;
    var abc = JSON.parse(JSON.stringify(checkboxItems))
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
    
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i]._id == values[j]) {
          checkboxItems[i].checked = true;
          checkboxItems[i].type = 0;
          abc.splice(i,1)
          const db = wx.cloud.database();
          db.collection('todos').doc(values[j]).update({
            data: {
              type: 0,
            },
            success: res => {
              that.setData({
                todos: checkboxItems,
              })
              setTimeout(function(){
                wx.showToast({
                  title: 'Great!',
                  icon: "success",
                  duration: 300,
                  success: function (e) {
                    that.setData({
                      todos: abc
                    })
                    console.log(abc)
                  }
                })


              },500)
               
              }
              
              // wx.showToast({
              //   title: 'Great!',
              //   icon: "success",
              //   duration: 2000,
              // })
              // setTimeout(function(){},5000);
              // console.log(abc)
              // that.setData({
              //   todos:abc
              // })
               
          
          })
          
          break;
        }
      }
     
    }
  
    }
  },
  ondelete:function(e){
    var id = e.currentTarget.dataset.id;
    var todos = this.data.todos;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗?',
      success:function(res){
        if(res.confirm) {
        
        const db = wx.cloud.database();
        db.collection('todos').doc(id).remove();
        for (var t = 0; t < todos.length; t++) {
          if (todos[t]._id == id) {
            todos.splice(t, 1);
            that.setData({
              todos:todos
            })
            break;
          }
        }
        
      }
      }
    })
    // console.log(flag)
    // if(flag==1){
    //   this.setData({
    //     todos:todos
    //   })
    //   console.log(todos)
    // }
   
  },
  todelete:function(e){
    var id = e.currentTarget.dataset.id;
    var todos = this.data.todos;
    var that = this;
    

   const db = wx.cloud.database();
   db.collection('todos').doc(id).remove();
   for (var t = 0; t < todos.length; t++) {
   if (todos[t]._id == id) {
   todos.splice(t, 1);
      that.setData({
        todos: todos
      })
      break;
    }
    }

     
  },
  addtask:function(e){
    wx.navigateTo({
      url: '../todo/newlist?type=0',
    })

  },
  touchS:function(e){
    // this.setData({
    //   startX:e.touches[0].clientX,
    //   startY:e.touched[0].clientY
    // })
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  },
  touchM:function(e){
    var id = e.currentTarget.dataset.id;
    var copytodos = this.data.todos;
    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;
    var index;
    const x = this.startX - this.currentX; //横向移动距离
    const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
    for (var i = 0; i < copytodos.length; i++) {

      if (copytodos[i]._id == id) {
        index = i;
        break;
      }
    }
    if (x > 35 && y < 110) {
      //向左滑是显示删除
      copytodos[index].delete = true;

      this.setData({
        todos:copytodos
      })
      console.log(this.data.todos)
    } else if (x < -35 && y < 110) {
      //向右滑
      copytodos[index].delete = false;

      this.setData({
        todos:copytodos
      })
    }

  },
  ondetail:function(e){
    var id = e.currentTarget.dataset.id;
    var mytask1,due1,myremark1;
    for(var i=0;i<this.data.todos.length;i++){
      if(this.data.todos[i]._id==id){
        mytask1 = this.data.todos[i].mytask;
        due1 = this.data.todos[i].due;
        myremark1 = this.data.todos[i].myremark;
        break;
      }
    }
    wx.navigateTo({
      url: "../todo/newlist?mytask="+mytask1+"&due="+due1+"&myremark="+myremark1+"&id="+id,
    })
  },
  tosucceed:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id);
    var newtodos = this.data.todos;
    var abc = JSON.parse(JSON.stringify(newtodos))
    for(var i=0;i<this.data.todos.length;i++){
      if(newtodos[i]._id == id){
        var that = this;
        abc.splice(i,1);
        newtodos[i].type=(newtodos[i].type+1)%2;
        const db = wx.cloud.database();
        db.collection('todos').doc(id).update({
          data: {
            type: newtodos[i].type
          },
          success: res => {
            
            this.setData({
              todos:newtodos
            })
            console.log("bbb", this.data.todos)
            wx.showToast({
              title: 'Congratulations!',
              icon:"success",
              duration:5000,
            })
              
              that.setData({
                todos:abc
              })
              console.log("aaa",this.data.todos)
          },
        })
      }    
    }
  },
  onCollectionTap:function(e){
    
    var id = e.currentTarget.dataset.id;
    console.log(id);
    var todos1 = this.data.todos;
    for(var i=0;i<this.data.todos.length;i++){
      if(todos1[i]._id == id){
        todos1[i].collected = (todos1[i].collected+1)%2;
        console.log(todos1[i].collected)
        const db = wx.cloud.database();
        db.collection('todos').doc(id).update({
          data:{
            collected:todos1[i].collected,
          },
          success: res => {
            this.setData({
             todos:todos1
            })
          },
          fail: err => {
            icon: 'none',
              console.error('[数据库] [更新记录] 失败：', err)
          }
        })
        
    }
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
    const db = wx.cloud.database()
    db.collection('todos').where({
      _openid: this.data.openid,
      type: 1,
    })
      .orderBy('gmtCreate', 'desc')
      .get({
        success: res => {
          this.setData({
            todos: res.data,
            task_length:res.data.length>0?true:false
          })

        },
        fail: err => {
          wx.showToast({
            title: 'Error!',
          })
        }
      })
  },
  bindTouchStart: function (e) {//触碰开始
    this.startTime = e.timeStamp;
    this.setData({
      startTime: e.timeStamp
    })
  },
  bindTouchEnd: function (e) {//触碰结束
    this.setData({
      endTime: e.timeStamp
    })
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