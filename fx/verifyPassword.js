const bcrypt = require("bcrypt")
const verifyPassword = async (password, hashedPassword) => {
  const passwordMatch = await bcrypt.compare(password, hashedPassword)
  return passwordMatch
}
module.exports = verifyPassword
