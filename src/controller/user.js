const login = (username, password) => {
  if (username == '123' && password == 123) {
    return true
  } else {
    return false
  }
}

module.exports = {
  login
}