const db = require("../db/db_connection")
const generateId = require("../middlewares/id")
const { URL } = require("../constants/api")

//GET BLOG
const getBlog = (req, res) => {
  const query = "SELECT * FROM posteos"
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error to get blog: ", error)
      res.status(500).send("Error to get blog")
    } else {
      console.log("---- Blog sent to client ----")
      const data = result.map((post) => {
        return {
          ...post,
          IMG: `${URL}/data/posteos/${post.IMG}.png`,
          IMG_DETAIL: `${URL}/data/posteos/${post.IMG_DETAIL}.png`,
        }
      })
      res.status(200).json(data)
    }
  })
}

//ADD POST
const addPost = (req, res) => {
  const { post } = req.body
  const postData = JSON.parse(post)
  const images = req.files
  console.log(images)
  const imagesNames = images.map((img) => {
    return img.originalname.replace(/\.[^/.]+$/, "")
  })
  const id = generateId(`${post.titulo}-${post.descripcion}`)
  const postDataModified = {
    ID: id,
    TITULO: postData.titulo,
    DESCRIPCION: postData.descripcion,
    IMG_DETAIL: imagesNames[0],
    IMG: imagesNames[1],
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
