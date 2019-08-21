const env = process.env.NODE_ENV

let MYSQL_CONF
if (env == 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '123321',
    port: '3306',
    database: 'mycomponent'
  }
}

if (env == 'production') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '123321',
    port: '3306',
    database: 'mycomponent'
  }
}

module.exports = {
  MYSQL_CONF
}