
const handleBlog = require('./src/router/blog')
const handleUser = require('./src/router/user').blogUserRouter
const querystring = require('querystring')
const getCookieExpires = require('./src/router/user').getCookieExpires


// session数据
const SESSION_DATA = {}

// 用于处理post
const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
  
}

const serverHandle = (req, res) => {
  res.setHeader('Content-type', 'application/json')
  req.query = querystring.parse(req.url.split('?')[1])
  // 获取、解析cookie
  const cookieStr = req.headers.cookie || '';
  req.cookie = {}
  const cookieArr = cookieStr.split(';')
  cookieArr.forEach((each) => {
    req.cookie[each.split('=')[0].trim()] = each.split('=')[1]
  })
  // 解析session
  let needSetCookie = false
  let userId = req.cookie.userid
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {}
    }
  } else {
    // 没有userid要设置cookie
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    SESSION_DATA[userId] = {}
  }
  req.sessionId = userId
  req.session = SESSION_DATA[userId]

  getPostData(req).then((postData) => {
    req.body = postData
    const blogResult = handleBlog(req, res)
    if (blogResult) {
      blogResult.then(blogData => { 
        if (blogData) {
          if (needSetCookie) {
            res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()};`)
          }
          res.end(JSON.stringify(blogData)) 
        }
      })
      return
    }
    
    
    const userResult = handleUser(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (userData) {
          if (needSetCookie) {
            res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()};`)
          }
          res.end(JSON.stringify(userData)) 
        }
      })
      return
    }
    res.writeHead(404, {
      "Content-type": "text/plain"
    })
    res.write('404 Not Found')
    res.end()
  })
}

module.exports = serverHandle