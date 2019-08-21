const http = require('http')
const serverHandle = require('../app')
const server = http.createServer(serverHandle)

server.listen(8000)
console.log('ok')