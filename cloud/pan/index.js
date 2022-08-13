// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rq = require('request-promise')
const cheerio = require('cheerio')
const qs = require('qs')
// const { post } = require('request-promise')
const axios = require('axios')
const fs = require('fs')
const { map, next } = require('cheerio/lib/api/traversing')

cloud.init({
  env: 'pan-4gym5b4rffd78434'
})

// 云函数入口函数
exports.main = (event, context) => {
  const app = new TcbRouter({ event });
  // 爬取首页热门搜索
  app.router('hot', async (ctx, next) => {
    return rq({
      url: `https://www.xuesousou.com/`,
      headers: {
        //"content-type": "application/json",
        "content-Type": "text/html;charset=UTF-8;",
      },
    }).then((res => {
      // return res
      const $ = cheerio.load(res)
      const list = $('.w650').children('ul').find('li').text()
      ctx.body = list
    }))
  })
  app.router('hot1', async (ctx, next) => {
    return rq({
      url: `http://www.kengso.com/`,
      headers: {
        //"content-type": "application/json",
        "content-Type": "text/html;charset=UTF-8;",
      },
    }).then((res => {
      var aa = {}
      // return res
      const $ = cheerio.load(res)
      const list = $('.bd').find('ul')
      var p = new Promise((res, rej) => {
        var bb = []
        list.map((i, d) => {
          if (i == 1 || i == 4 || i == 5) {
            var cc = {}
            cc.i = i
            cc.text = $(d).text()
            bb.push(cc)
            // $(d).map((j,q)=>{
            //   var cc=[]
            //   if(j<11){
            //     var dd={}
            //     dd.text=$(q).text()
            //     cc.push(dd)
            //   }
            // bb.push(cc)
            // })
          }
        })
        res(bb)
      })
      p.then(res => {
        aa.list = res
      })
      ctx.body = aa
    }))
  })
  app.router('hot2', async (ctx, next) => {
    return rq({
      url: `https://www.56wangpan.com`,
      headers: {
        //"content-type": "application/json",
        'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
        "content-Type": "text/html;charset=UTF-8;",
      },
    }).then((res => {
      var aa = {}
      // return res
      const $ = cheerio.load(res)
      const list = $('.sellListContent').find('li')+
      var p = new Promise((res, rej) => {
        var bb = []
        list.map((i, d) => {
          var cc = {}
          cc.title = $(d).children('.info ').children('.title').text()
          cc.url = $(d).children('a').attr('href')
          cc.context = $(d).children('a').text()
          bb.push(cc)
        })
        res(bb)
      })
      p.then(res => {
        aa.list = res
      })
      ctx.body = aa
    }))
  })
  app.router('hot3', async (ctx, next) => {
    await axios({
      url: `https://www.fastsoso.cn`,
      headers: {
        'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
      }
    }).then((res => {
      var aa = []
      // return res
      const $ = cheerio.load(res.data)
      const list = $('#home').find('div')
      list.map((i, d) => {
        var bb = $(d).children('a').text()
        aa.push(bb)
      })

      ctx.body = aa
    }))
  })
  // 爬取关键字列表
  app.router('list', async (ctx, next) => {
    var aa = encodeURIComponent(event.value)
    return rq({
      url: `https://www.kolsou.com/search?q=${aa} &page=${event.page}`,
      headers: {
        //"content-type": "application/json",
        "content-Type": "text/html;charset=UTF-8;",
      },
    }).then((res => {
      // return res
      var aa = {}
      const $ = cheerio.load(res)
      const new_title = $('.data_list_title').children('font').text()
      aa.num = new_title
      var news_title = $('.search').find('ul>li')
      // bb.push(news_title.children('.title').text()+news_title.children('.title>a').attr('href'))
      var p = new Promise((res, rej) => {
        var bb = []
        news_title.map((i, d) => {
          var cc = {}
          cc.title = $(d).children('.title').text()
          cc.url = $(d).children('.title').children('a').attr('href')
          cc.context = $(d).children('.summary').text()
          bb.push(cc)
        })
        res(bb)
      })
      p.then(res => {
        aa.list = res
      })
      ctx.body = aa
    }))
  })
  app.router('list1', async (ctx, next) => {
    var aa = encodeURIComponent(event.value)
    return rq({
      url: `http://www.kengso.com/s?st=${event.page - 1}&wd=${aa}`,
    }).then((res => {
      // return res
      var aa = {}
      const $ = cheerio.load(res)
      var news_title = $('.user-share-list').find('ul>li')
      var num = $('.paging').children().last().prev().text()
      aa.num = num
      var p = new Promise((res, rej) => {
        var bb = []
        news_title.map((i, d) => {
          var cc = {}
          cc.title = $(d).children('a').children('.l-title').text()
          cc.url = $(d).children('a').attr('href')
          cc.context = $(d).children('a').text()
          bb.push(cc)
        })
        res(bb)
      })
      p.then(res => {
        aa.list = res
      })
      ctx.body = aa
    })).catch((err => {
      ctx.body = 22
    }))

  })
  app.router('list2', async (ctx, next) => {
    var aa = encodeURIComponent(event.value)
    return rq({
      url: `https://www.soupan8.com/search/kw${aa}pg${event.page}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36'
      },
    }).then((r => {
      var aa = {}
      const $ = cheerio.load(r)
      var news_title = $('.sellListContent').find('li')
      var num = $('.list-page-box').children().last().prev().text()
      aa.num = num
      var p = new Promise((res, rej) => {
        var bb = []
        news_title.map((i, d) => {
          var cc = {}
          cc.title = $(d).children('.clear').children('.title').text()
          cc.url = $(d).children('a').attr('href')
          cc.context = $(d).children('a').text()
          bb.push(cc)
        })
        res(bb)
      })
      p.then(res => {
        aa.list = res
      })
      ctx.body = aa
    }))

  })
  app.router('list3', async (ctx, next) => {
    var aa = encodeURIComponent(event.value)
    await axios({
      url: `https://www.fastsoso.cn/search?k=${aa}&page=${event.page}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
      },
    }).then((res => {
      // return res
      var aa = {}
      const $ = cheerio.load(res.data)
      const new_title = $('.col-md-offset-3').children('div')
      aa.num = new_title.children('b').text()
      var news_title = new_title.find('div')
      var list = []
      news_title.map((i, d) => {
        var zz = {}
        var aa = $(d).attr('style')
        if (aa == 'padding-top: 10px;') {
          var title = $(d).children('div:nth-child(2)').children('strong').children('a').text()
          var url = $(d).children('div:nth-child(2)').children('strong').children('a').attr('href')
        }
        zz.title = title
        zz.url = url
        if (zz.url != undefined) {
          list.push(zz)
        }
      })
      aa.list = list
      ctx.body = aa
    }))
  })
  // 关键字列表详情
  app.router('com', async (ctx, next) => {
    return rq({
      url: `https://www.kolsou.com${event.url}`,
      headers: {
        //"content-type": "application/json",
        "Content-Type": "text/html;charset=UTF-8;",
      },
    }).then((res => {
      // return res
      var aa = {}
      const $ = cheerio.load(res)
      const new_title = $('.data_row').text()
      aa.headline = new_title
      var news_title = $('.fa').children('div').text()
      var ma = $('.fa').text()
      var url = $('.fa').children('div').children('a').attr('href')
      aa.con = news_title
      aa.url = url
      aa.ma = ma
      ctx.body = aa
    }))
  })
  app.router('com1', async (ctx, next) => {
    await axios.get(event.url, {
      headers: {
        "Referer": 'http://www.kengso.com/'
      },
    }).then((res => {
      ctx.body = JSON.stringify(res.data)
    }))
  })
  app.router('com2', async (ctx, next) => {
    await axios.get(`https://www.soupan8.com/redirect${event.url}`, {
      headers: {
        "Referer": `https://www.soupan8.com${event.urls}`
      },
    }).then((res => {
      var aa = {}
      const $ = cheerio.load(res.data)
      const url = $('#tip_msg').children('p:nth-child(2)').children('a').text()
      const text = $('#tip_msg').children('p:nth-child(3)').text()
      aa.url = url
      aa.text = text
      ctx.body = aa
    }))
  })
  app.router('com3', async (ctx, next) => {
    await axios.get(`https://www.fastsoso.cn/file/info?${event.url}`, {
      headers: {
        // "Referer": `https://www.soupan8.com${event.urls}`
      }
    }).then(r => {
      var aa = {}
      const $ = cheerio.load(r.data)
      const new_title = $('.list-group').find('li')
      var title = []
      new_title.map((i, d) => {
        var aaa = $(d).text()
        title.push(aaa)
      })
      const avail = $('#avail').attr('value')
      aa.index = avail
      aa.con = title
      ctx.body = aa
    })
  })
  app.router('com3Url', async (ctx, next) => {
    let data = {"check":event.index};
    await axios.post('https://www.fastsoso.cn/file/fetch', qs.stringify(data), {
      headers: {
        "Referer": `https://www.fastsoso.cn/file/info?${event.url}`
      }
    }).then(r=>{
      ctx.body=r.data

    })
  })

  // 关键字联想列表
  app.router('related', async (ctx, next) => {
    var aa = encodeURIComponent(event.q)
    return rq({
      url: `https://www.kolsou.com/article/loadRelatedResource`,
      method: 'post',
      qs: { q: event.q },
    }).then((res => {
      ctx.body = JSON.parse(res)
    }))
  })
  app.router('related1', async (ctx, next) => {
    var aa = encodeURIComponent(event.value)
    return rq({
      url: `https://tip.soku.com/search_tip_1?query=${aa}`,
    }).then((res => {
      ctx.body = JSON.parse(res)
    })).catch((err => {
      ctx.body = 22
    }))
  })

  app.router('related3', async (ctx, next) => {
    await axios.get(`https://www.fastsoso.cn/file/info?${event.url}`, {
      headers: {
        // "Referer": `https://www.soupan8.com${event.urls}`
      }
    }).then(r => {
      const $ = cheerio.load(r.data)
      const new_title = $('.panel-body').find('p')
      var title = []
      new_title.map((i, d) => {
        if($(d).attr('style')=='overflow:hidden;white-space:nowrap;text-overflow:ellipsis;'){
          var aaa={}
          aaa.title= $(d).children('a').text()
          aaa.url= $(d).children('a').attr('href')
          title.push(aaa)
        }
      })
      ctx.body = title
    })
  })
  
  return app.serve();

}