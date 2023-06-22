const express = require("express")
const cors = require("cors")
const multer = require("multer")
const jwt = require("jsonwebtoken")

require("dotenv").config()

const db = require("./db/db_connection")
const verifyPassword = require("./fx/verifyPassword")
const app = express()

const generateId = require("./fx/generateId")

app.use(cors())
app.use(express.json())
app.use("/data", express.static("./data"))

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

const port = process.env.PORT
const url = process.env.URL

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

//GET CATEGORIES
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

//GET PRODUCTS
app.get("/products", (req, res) => {
  const query = "SELECT * FROM velas"
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error to get products: ", error)
      res.status(500).send("Error to get products")
    } else {
      const data = result.map((product) => {
        const imagesUrl = JSON.parse(product.IMAGENES)
        const imagesArray = Object.keys(imagesUrl).map((key) => {
          const imageUrl = imagesUrl[key]
          const imageNumber = Object.keys(imageUrl)[0]
          const imageUrlWithNumber = `${url}/data/velas/${imageNumber}.jpg`
          return {
            ...imageUrl,
            url: imageUrlWithNumber,
          }
        })
        return { ...product, IMAGENES: imagesArray }
      })
      console.log("---- Products sent to client ----")
      res.status(200).json(data)
    }
  })
})

//ADD PRODUCT
app.post("/products", uploadProductImages.array("images"), (req, res) => {
  const { product } = req.body
  const productData = JSON.parse(product)
  const images = req.files
  const imagesWithColors = images.map((image, index) => {
    return {
      [image.filename.replace(/\.[^/.]+$/, "")]: productData.colores[index],
    }
  })
  const productDataModified = {
    CODIGO: productData.codigo,
    NOMBRE: productData.nombre,
    PESO: productData.peso ? parseFloat(productData.peso) : null,
    ALTURA: productData.altura ? parseFloat(productData.altura) : null,
    ANCHO: productData.ancho ? parseFloat(productData.ancho) : null,
    DIAMETRO_SUPERIOR: productData.diametro_superior
      ? parseFloat(productData.diametro_superior)
      : null,
    DIAMETRO_INFERIOR: productData.diametro_inferior
      ? parseFloat(productData.diametro_inferior)
      : null,
    MECHA_ECOLOGICA: productData.mecha_ecologica,
    AROMA:
      productData.con_aroma && productData.sin_aroma
        ? 2
        : productData.con_aroma
        ? 1
        : 0,
    TIEMPO_QUEMADO: productData.tiempo_quemado
      ? parseInt(productData.tiempo_quemado)
      : null,
    IMAGENES: JSON.stringify(imagesWithColors),
    ETIQUETAS:
      productData.etiquetas.length > 0
        ? JSON.stringify(productData.etiquetas)
        : null,
    CATEGORIA: productData.categoria,
  }
  const query = "INSERT INTO velas SET ?"
  db.query(query, productDataModified, (error, result) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ message: "El producto ya existe" })
      } else {
        res
          .status(500)
          .json({ message: "Se produjo un error al agregar el producto" })
      }
    } else {
      console.log("Product added")
      res.status(200).json({ message: "Producto agregado correctamente" })
    }
  })
})

//DELETE PRODUCT
app.delete("/products", (req, res) => {
  const { codigo } = req.body
  const query = "DELETE FROM velas WHERE CODIGO = ?"
  db.query(query, codigo, (error, result) => {
    if (error) {
      console.error("Error to delete product: ", error)
      res.status(500).json({ message: "Error to delete product" })
    } else {
      console.log("Product deleted")
      res.status(200).json({ message: "Producto eliminado correctamente" })
    }
  })
})

//UPDATE VELA OF THE MONTH
app.put("/products/favorite", (req, res) => {
  const { codigo } = req.body
  const query = "UPDATE vela_del_mes SET CODIGO = ?"
  db.query(query, codigo, (error, result) => {
    if (error) {
      console.error("Error to update favorite: ", error)
      res.status(500).send("Error al actualizar vela del mes")
    } else {
      console.log("Favorite updated")
      res
        .status(200)
        .json({ message: "Vela del mes actualizada correctamente" })
    }
  })
})

//GET VELA OF THE MONTH
app.get("/products/favorite", (req, res) => {
  const query =
    "SELECT * FROM velas INNER JOIN vela_del_mes on velas.CODIGO = vela_del_mes.CODIGO"
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error to get favorite: ", error)
      res.status(500).send("Error to get favorite")
    } else {
      const productData = {
        ...result[0],
        IMAGENES: JSON.parse(result[0].IMAGENES),
      }
      const imagesArray = Object.keys(productData.IMAGENES).map((key) => {
        const imageUrl = productData.IMAGENES[key]
        const imageNumber = Object.keys(imageUrl)[0]
        const imageUrlWithNumber = `${url}/data/velas/${imageNumber}.jpg`
        return {
          ...imageUrl,
          url: imageUrlWithNumber,
        }
      })
      const response = { ...productData, IMAGENES: imagesArray }
      res.status(200).json({ vela: response })
    }
  })
})

//GET BLOG
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

//ADD POST
app.post("/blog", uploadBlogImages.array("images"), (req, res) => {
  const { post } = req.body
  const postData = JSON.parse(post)
  const images = req.files
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
})

//DELETE POST
app.delete("/blog", (req, res) => {
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
})

//ADMIN LOGIN
app.post("/authentication", (req, res) => {
  const { email, password } = req.body
  const query = "SELECT * FROM usuarios WHERE EMAIL = ?"
  db.query(query, [email], async (error, user) => {
    if (error) {
      res.status(500).send("ERROR TO GET USER!")
    } else {
      if (user.length === 0) {
        res.status(404).send("USER NOT FOUND!")
      } else {
        const passwordMatch = await verifyPassword(password, user[0].PASSWORD)
        if (!passwordMatch) {
          res.status(401).send("PASSWORD INCORRECT!")
        } else {
          const userData = {
            id: user[0].ID,
            email: user[0].EMAIL,
          }
          const secureKey = process.env.SECURE_KEY
          const token = jwt.sign({ id: userData.id }, secureKey, {
            expiresIn: 60 * 60 * 24,
          })
          const query = "INSERT INTO tokens (token) VALUES (?)"
          db.query(query, [token], async (error, result) => {
            if (error) {
              res.status(500).send("Internal error")
            } else {
              res.status(200).json({ token: token, userData: userData })
            }
          })
        }
      }
    }
  })
})

app.post("/authentication/tokens", (req, res) => {
  const { token } = req.body
  const query = "SELECT * FROM tokens WHERE TOKEN = ?"
  db.query(query, [token], (error, result) => {
    if (error) {
      console.log("Internal error")
      res.status(500).send("Internal error")
    } else {
      try {
        const secureKey = process.env.SECURE_KEY
        const decodedToken = jwt.verify(result[0].TOKEN, secureKey)
        const currentDate = Date.now()
        if (decodedToken.exp * 1000 > currentDate) {
          console.log("Token is valid")
          res.status(200).json({ tokenIsValid: true })
        } else {
          console.log("Token expirated")
          res.status(401).json({ tokenIsValid: false })
        }
      } catch {
        console.log("Token is invalid")
        res.status(401).json({ tokenIsValid: false })
      }
    }
  })
})

app.delete("/authentication/tokens", (req, res) => {
  const { token } = req.body
  const query = "DELETE FROM tokens WHERE TOKEN = ?"
  db.query(query, [token], (error, result) => {
    if (error) {
      console.log(error)
      res.status(500).send("Internal error")
    } else {
      res.status(200).send({ tokenDeleted: true })
    }
  })
})
