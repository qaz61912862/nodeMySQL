const { login }  = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const blogUserRouter = (req, res) => {
  const url = req.url
  const path = url.split('?')[0]
  const method = req.method
  if (method == 'POST' && path == '/api/user/login') {
    const username = req.body.username
    const password = req.body.password
    const result = login(username, password)
    if (result) {
      return new SuccessModel(result, '登录成功')
    } else {
      return new ErrorModel('账号密码错误')
    }
  }
  return false
}

module.exports = blogUserRouter