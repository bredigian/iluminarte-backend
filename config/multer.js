const multer = require("multer")

const storageImages = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const uploadImages = multer({ storage: storageImages })

module.exports = {
  uploadImages,
}
