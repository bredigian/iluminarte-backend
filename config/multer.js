const multer = require("multer")

const storageProducts = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./data/velas")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const storageBlog = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./data/posteos")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const uploadProductImages = multer({ storage: storageProducts })
const uploadBlogImages = multer({ storage: storageBlog })

module.exports = {
  uploadProductImages,
  uploadBlogImages,
}
