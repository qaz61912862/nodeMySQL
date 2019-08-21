
const handleBlog = require('./src/router/blog')
const handleUser = require('./src/router/user')
const querystring = require('querystring')

// 用于处理post
const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      console.log(222)
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
  getPostData(req).then((postData) => {
    req.body = postData
    const blogResult = handleBlog(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (blogData) {
          console.log(3323232)
          res.end(JSON.stringify(blogData)) 
        }
      })
      return
    }
    
    
    const userData = handleUser(req, res)
    if (userData) {
      res.end(JSON.stringify(userData))
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