const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../db/db_connection")

const comparePassword = async (password, hashedPassword) => {
  const passwordMatch = await bcrypt.compare(password, hashedPassword)
  return passwordMatch
}

const validatePassword = async (formPassword, userData, res) => {
  const passwordMatch = await comparePassword(formPassword, userData.PASSWORD)
  if (!passwordMatch) {
    res.status(401).send("PASSWORD INCORRECT!")
  } else {
    const user = {
      id: userData.ID,
      email: userData.EMAIL,
    }
    const secureKey = process.env.SECURE_KEY
    const token = jwt.sign({ id: user.id }, secureKey, {
      expiresIn: 60 * 60 * 24,
    })
    const query = "INSERT INTO tokens (token) VALUES (?)"
    db.query(query, [token], async (error, result) => {
      if (error) {
        res.status(500).send("Internal error")
      } else {
        res.status(200).json({ token: token, userData: user })
      }
    })
  }
}

module.exports = {
  comparePassword,
  validatePassword,
}
