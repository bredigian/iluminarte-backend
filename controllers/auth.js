const db = require("../db/db_connection")
const { validatePassword } = require("../middlewares/password")
const { tokenValidation } = require("../middlewares/token")

//SIGN IN
const signIn = (req, res) => {
  const { email, password } = req.body
  const query = "SELECT * FROM usuarios WHERE EMAIL = ?"
  db.query(query, [email], async (error, user) => {
    if (error) {
      res.status(500).send("ERROR TO GET USER!")
    } else {
      if (user.length === 0) {
        res.status(404).send("USER NOT FOUND!")
      } else {
        validatePassword(password, user[0], res)
      }
    }
  })
}

//VERIFY SESSION
const verifySession = (req, res) => {
  const { token } = req.body
  const query = "SELECT * FROM tokens WHERE TOKEN = ?"
  db.query(query, [token], (error, result) => {
    if (error) {
      console.log("Internal error")
      res.status(500).send("Internal error")
    } else {
      try {
        tokenValidation(result[0]?.TOKEN, res)
      } catch {
        console.log("Token is invalid")
        res.status(401).json({ tokenIsValid: false })
      }
    }
  })
}

//SIGN OUT
const signOut = (req, res) => {
  const { token } = req.body
  const query = "DELETE FROM tokens WHERE TOKEN = ?"
  db.query(query, [token], (error, result) => {
    if (error) {
      console.log(error)
      res.status(500).send("Internal error")
    } else {
      res.status(200).send({ tokenDeleted: true })
    }
  })
}

module.exports = {
  signIn,
  verifySession,
  signOut,
}
