const { login }  = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set, get }  = require('../db/redis')

// 获取cookie过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 *1000))
  return d.toGMTString()
}

const blogUserRouter = (req, res) => {
  const url = req.url
  const path = url.split('?')[0]
  const method = req.method
  if (method == 'GET' && path == '/api/user/login') {
    // const username = req.body.username
    // const password = req.body.password
    const username = req.query.username
    const password = req.query.password
    const result = login(username, password)
    return result.then((data) => {
      if (data && data.username) {
        // 后端操作cookie
        req.session.username = data.username
        req.session.realname = data.realname
        // 同步到redis
        set(req.sessionId, req.session)
        return new SuccessModel(result, '登录成功')
      } else {
        return new ErrorModel('账号密码错误')
      }
    })
  }
  if (method == 'GET' && path == '/api/user/login/test') {
    // console.log(req.cookie)
    // console.log(req.session)
    if (req && req.session && req.session.username) {
      return get(req.sessionId).then((result) => {
        return Promise.resolve(new SuccessModel({
          session: result
        },'已登录'))
      })
      
    } else {
      return Promise.resolve(new ErrorModel('尚未登录'))
    }
  }

  return false
}

module.exports = {
  blogUserRouter,
  getCookieExpires
}