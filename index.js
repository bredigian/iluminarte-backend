const express = require("express")
const cors = require("cors")
const multer = require("multer")

require("dotenv").config()

const db = require("./db/db_connection")

const app = express()
app.use(cors())
app.use("/data", express.static("./data"))

const upload = multer({ dest: "data" })

const port = process.env.PORT
const url = process.env.URL

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

app.get("/categories", (req, res) => {
  const query = "SELECT * FROM categorias"
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error to get categories: ", error)
      res.status(500).send("Error to get categories!!!")
    } else {
      console.log("---- Categories sent to client ----")
      res.status(200).json(result)
    }
  })
})

app.get("/products", (req, res) => {
  const query = "SELECT * FROM velas"
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error to get products: ", error)
      res.status(500).send("Error to get products!!!")
    } else {
      const data = result.map((product) => {
        const imagesUrl = JSON.parse(product.IMAGENES)
        const imagesArray = Object.keys(imagesUrl).map((key) => {
          return {
            color: imagesUrl[key],
            url: `${url}/data/velas/${key}.jpg`,
          }
        })
        return { ...product, IMAGENES: imagesArray }
      })
      console.log("---- Products sent to client ----")
      res.status(200).json(data)
    }
  })
})

app.get("/blog", (req, res) => {
  const query = "SELECT * FROM posteos"
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error to get blog: ", error)
      res.status(500).send("Error to get blog!!!")
    } else {
      console.log("---- Blog sent to client ----")
      const data = result.map((post) => {
        return {
          ...post,
          IMG: `${url}/data/posteos/${post.IMG}.png`,
          IMG_DETAIL: `${url}/data/posteos/${post.IMG_DETAIL}.png`,
        }
      })
      res.status(200).json(data)
    }
  })
})
