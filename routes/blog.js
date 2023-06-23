const express = require("express")
const { addPost, deletePost, getBlog } = require("../controllers/blog")
const router = express.Router()
const { uploadBlogImages } = require("../config/multer")

//GET BLOG
router.get("/", getBlog)

//ADD POST
router.post("/", uploadBlogImages.array("images"), addPost)

//DELETE POST
router.delete("/", deletePost)

module.exports = router
