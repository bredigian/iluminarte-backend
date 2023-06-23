const jwt = require("jsonwebtoken")

const tokenValidation = (token, res) => {
  const secureKey = process.env.SECURE_KEY
  const decodedToken = jwt.verify(token, secureKey)
  const currentDate = Date.now()
  if (decodedToken.exp * 1000 > currentDate) {
    console.log("Token is valid")
    res.status(200).json({ tokenIsValid: true })
  } else {
    console.log("Token expirated")
    res.status(401).json({ tokenIsValid: false })
  }
}

module.exports = { tokenValidation }
