const fs = require('fs')
const path = require('path')



// function getFileContent(fileName, callback) {
//   const fullFileName = path.resolve(__dirname, 'files', fileName)
//   fs.readFile(fullFileName, (err, data) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     callback(JSON.parse(data.toString()))
//     // console.log(data.toString())
//   })
// }

// 循环导致回调地狱
getFileContent('a.json', aData => {
  getFileContent(aData.next, bData => {
    console.log(bData)
  })
})

// 用Promise解决
function getFileContent(fileName) {
  const promise = new Promise((resolve, reject) => {
    const fullFileName = path.resolve(__dirname, 'files', fileName)
    fs.readFile(fullFileName, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(JSON.parse(data.toString()))
    })
  })
  return promise
}

getFileContent('a.json').then((res) => {
  console.log(res)
  return getFileContent(res.next)
}).then((res) => {
  console.log(res)
  return getFileContent(res.next)
}).then((res) => {
  console.log(res)
})