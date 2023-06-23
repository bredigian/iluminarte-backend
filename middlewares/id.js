const shortId = require("shortid")

const generateId = (string) => {
  return shortId.generate(string).toLowerCase()
}
module.exports = generateId
