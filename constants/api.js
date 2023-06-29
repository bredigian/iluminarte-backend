const PORT = process.env.PORT || 3001
const URL = process.env.URL || `http://localhost:${PORT}`
const URL_FRONT = process.env.URL_FRONT || `http://localhost:3000`
const NULL_IMAGE = process.env.CLOUDINARY_NULL_IMAGE

module.exports = { URL, PORT, URL_FRONT, NULL_IMAGE }
