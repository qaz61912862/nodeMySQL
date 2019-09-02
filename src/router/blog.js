const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlog = (req, res) => {
  const url = req.url
  const path = url.split('?')[0]
  const method = req.method
  const id = req.query.id
  if (method == 'GET' && path == '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    // const listData = getList(author, keyword)
    // return new SuccessModel(listData, 'success')
    const result = getList(author, keyword)
    return result.then(listData => {
      return new SuccessModel(listData, 'success')
    })
  }
  if (method == 'GET' && path == '/api/blog/detail') {
    const result = getDetail(id)
    return result.then(detailData => {
      return new SuccessModel(detailData, 'success')
    })
  }
  if (method == 'POST' && path == '/api/blog/new') {
    const blogData = req.body
    const result = newBlog(blogData)
    return result.then(blogId => {
      return new SuccessModel(blogId, 'success')
    })
    // const blogData = req.body
    // const blogId = newBlog(blogData)
    // return new SuccessModel(blogId, 'success')
  }
  if (method == 'POST' && path == '/api/blog/update') {
    const result = updateBlog(id, req.body)
    if (result) {
      return result.then(res => {
        return new SuccessModel(res, 'success')
      })
    } else {
      return new ErrorModel('更新博客失败')
    }
    
  }
  if (method == 'POST' && path == '/api/blog/del') {
    const result = deleteBlog(id)
    if (result) {
      // return new SuccessModel(result, '删除博客成功')
      return result.then(res => {
        return new SuccessModel(res, '删除博客成功')
      })
    } else {
      return new ErrorModel('删除博客失败')
    }
  }
  return false
} 

module.exports = handleBlog