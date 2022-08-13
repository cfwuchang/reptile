// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init({
  env:'pan-4gym5b4rffd78434'
})

// 云函数入口函数
exports.main = (event, context) => {
  const app = new TcbRouter({ event });
  app.router('getlogin', async (ctx, next) => {
    const wxContext = cloud.getWXContext()
    ctx.body= cloud.database().collection('users').where({
      openid: wxContext.OPENID,
    }).get()
  });
  app.router('newUser', async (ctx, next) => {
    const wxContext = cloud.getWXContext()
    ctx.body= cloud.database().collection('users').add({
      data:{
        nickName:event.nickName,
        gender:event.gender,
        avatarUrl:event.avatarUrl,
        province:event.province,
        openid: wxContext.OPENID,
        switch: event.switch,
        history: [],
      }
    })
  });
  app.router('upuser', async (ctx, next) => {
    ctx.body= cloud.database().collection('users').where({
      openid:event.openid
    }).update({
      data:{
        ['switch.'+event.name]:event.value
      }
    })
  });
  app.router('uphistory', async (ctx, next) => {
    ctx.body= cloud.database().collection('users').where({
      openid:event.openid
    }).update({
      data:{
        history:[]
      }
    })
  });
  app.router('addhistory', async (ctx, next) => {
    const db = cloud.database();
    const _ = db.command;
    ctx.body= db.collection('users').where({
      openid:event.openid
    }).update({
      data:{
        history:_.push(event.v)
      }
    })
  });
  app.router('top10history', async (ctx, next) => {
    const db = cloud.database();
    const _ = db.command;
    ctx.body= db.collection('users').where({
      openid:event.openid
    }).update({
      data:{
        history:_.shift()
      }
    })
  });
  return app.serve();

}
// cloud.init()

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }