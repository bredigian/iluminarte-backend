const db = require("../db/db_connection")
const generateId = require("../middlewares/id")
const cloudinary = require("../config/cloudinary")

//GET BLOG
const getBlog = (req, res) => {
  const query = "SELECT * FROM posteos"
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error to get blog: ", error)
      res.status(500).send("Error to get blog")
    } else {
      console.log("---- Blog sent to client ----")
      res.status(200).json(result)
    }
  })
}

//ADD POST
const addPost = async (req, res) => {
  const { post } = req.body
  const postData = JSON.parse(post)
  console.log(postData)
  const id =
    Date.now() + generateId(`${postData.titulo}-${postData.descripcion}`)
  const images = req.files
  const imagesPath = images.map((img) => {
    return img.path
  })
  const imagesUploaded = await Promise.all(
    imagesPath.map(async (img) => {
      const urlResult = await cloudinary.uploader.upload(img, {
        folder: "posteos",
      })
      const { url } = urlResult
      return url
    })
  )
  const postDataModified = {
    ID: id,
    TITULO: postData.titulo,
    DESCRIPCION: postData.descripcion,
    IMG_DETAIL: imagesUploaded[0],
    IMG: imagesUploaded[1],
  }
  const query = "INSERT INTO posteos SET ?"
  db.query(query, postDataModified, (error, result) => {
    if (error) {
      console.error("Error to add post: ", error)
      res.status(500).json({ message: "Ocurrió un error al agregar el post" })
    } else {
      console.log("Post added")
      res.status(200).json({ message: "Post agregado correctamente" })
    }
  })
}

//DELETE POST
const deletePost = (req, res) => {
  const { id } = req.body
  const query = "DELETE FROM posteos WHERE ID = ?"
  db.query(query, id, (error, result) => {
    if (error) {
      console.error("Error to delete post: ", error)
      res.status(500).json({ message: "Error to delete post" })
    } else {
      console.log("Post deleted")
      res.status(200).json({ message: "Post eliminado correctamente" })
    }
  })
}

module.exports = {
  getBlog,
  addPost,
  deletePost,
}
