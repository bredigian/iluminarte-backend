const express = require("express")
const { signIn, verifySession, signOut } = require("../controllers/auth")
const router = express.Router()

//ADMIN LOGIN
router.post("/", signIn)

router.post("/tokens", verifySession)

router.delete("/tokens", signOut)

module.exports = router
