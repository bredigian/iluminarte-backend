require("dotenv").config()

const PORT = process.env.PORT || 3001
const URL = process.env.URL || `http://localhost:${PORT}`
const NULL_IMAGE = process.env.CLOUDINARY_NULL_IMAGE

module.exports = { URL, PORT, NULL_IMAGE }
