const express = require("express")
const { addPost, deletePost, getBlog } = require("../controllers/blog")
const router = express.Router()
const { uploadImages } = require("../config/multer")

//GET BLOG
router.get("/", getBlog)

//ADD POST
router.post("/", uploadImages.array("images"), addPost)

//DELETE POST
router.delete("/", deletePost)

module.exports = router
