const { exec } = require('../db/mysql')
const getList = (author, keyword) => {
  let sql = `
    select * from blog where 1=1
  `
  if (author) {
    sql += `and author='${author}'`
  }
  if (keyword) {
    sql += `and title like '%${keyword}%'`
  }
  sql += `order by createtime desc;`
  // 返回promise
  return exec(sql)
}

const getDetail = (id) => {
  let sql = `
    select * from blog where id=${id}
  `
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  const title = blogData.title
  const content = blogData.content
  const author = blogData.author
  const createTime = Date.now()
  const sql = `
    insert into blog (title, content, createtime, author) 
    values ('${title}', '${content}', ${createTime}, '${author}')
  `
  return exec(sql).then((insertData) => {
    console.log(insertData)
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = (id, blogData = {}) => {
  const title = blogData.title
  const content = blogData.content
  const author = blogData.author
  const createTime = Date.now()
  const sql = `
    update blog set title='${title}', content='${content}', author='${author}' where id=${id}
  `
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const deleteBlog = (id) => {
  const sql = `
    delete from blog where id=${id}
  `
  return exec(sql).then(rows => {
    return rows[0]
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}