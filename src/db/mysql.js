const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

//创建连接

const con = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '123321',
    port: '3306',
    database: 'mycomponent'
  }
)

con.connect()


function exec(sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
}


module.exports = {
  exec
}