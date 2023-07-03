const db = require("../db/db_connection")
const cloudinary = require("../config/cloudinary")

//GET PRODUCTS
const getProducts = (req, res) => {
  const query = "SELECT * FROM velas"
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error to get products: ", error)
      res.status(500).send("Error to get products")
    } else {
      const data = result.map((product) => {
        return {
          ...product,
          IMAGENES: JSON.parse(product.IMAGENES),
          ETIQUETAS: JSON.parse(product.ETIQUETAS),
          CATEGORIAS: JSON.parse(product.CATEGORIAS),
        }
      })
      console.log("---- Products sent to client ----")
      res.status(200).json(data)
    }
  })
}

//ADD PRODUCT
const addProduct = async (req, res) => {
  const { product } = req.body
  const productData = JSON.parse(product)
  const images = req.files
  const imagesPath = images.map((img) => {
    return img.path
  })
  const imagesData = await Promise.all(
    productData.colores.map(async (color, index) => {
      const urlResult = await cloudinary.uploader.upload(imagesPath[index], {
        folder: "velas",
        use_filename: true,
        filename_override: productData.codigos[index],
      })
      const { url } = urlResult
      return {
        COLOR: color,
        IMAGEN: url,
        CODIGO: productData.codigos[index],
      }
    })
  )
  const productDataModified = {
    CODIGO: productData.codigo_principal,
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
    MECHA_TRADICIONAL: productData.mecha_tradicional,
    MECHA_LED: productData.mecha_led,
    AROMA:
      productData.con_aroma && productData.sin_aroma
        ? 2
        : productData.con_aroma
        ? 1
        : 0,
    TIEMPO_QUEMADO: productData.tiempo_quemado
      ? parseInt(productData.tiempo_quemado)
      : null,
    IMAGENES: JSON.stringify(imagesData),
    ETIQUETAS:
      productData.etiquetas.length > 0
        ? JSON.stringify(productData.etiquetas)
        : null,
    CATEGORIAS: JSON.stringify(productData.categorias),
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
}

//DELETE PRODUCT
const deleteProduct = (req, res) => {
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
}

//GET PRODUCT OF THE MONTH
const getVelaOfTheMonth = (req, res) => {
  const query =
    "SELECT * FROM velas INNER JOIN vela_del_mes on velas.CODIGO = vela_del_mes.CODIGO"
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error to get favorite: ", error)
      res.status(500).send("Error to get favorite")
    } else {
      const data = result.map((product) => {
        return {
          ...product,
          IMAGENES: JSON.parse(product.IMAGENES),
          ETIQUETAS: JSON.parse(product.ETIQUETAS),
          CATEGORIAS: JSON.parse(product.CATEGORIAS),
        }
      })
      res.status(200).json({ vela: data[0] })
    }
  })
}

//UPDATE PRODUCT OF THE MONTH
const updateVelaOfTheMonth = (req, res) => {
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
}

const getPrevImageForVelaOfTheMonth = (req, res) => {
  const query = "SELECT * FROM prev_vela_del_mes"
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error to get prev image for vela of the month: ", error)
      res.status(500).send("Error to get prev image for vela of the month")
    } else {
      const data = result[0]
      res.status(200).json({ image: data.URL })
    }
  })
}

const setPrevImageForVelaOfTheMonth = async (req, res) => {
  const file = req.file
  const { path } = file
  const { url } = await cloudinary.uploader.upload(path, {
    folder: "home",
    use_filename: true,
    filename_override: Date.now().toLocaleString(),
  })
  const query = "UPDATE prev_vela_del_mes SET URL = ?"
  db.query(query, url, (error, result) => {
    if (error) {
      console.error("Error to set prev image for vela of the month: ", error)
      res.status(500).send("Error to set prev image for vela of the month")
    } else {
      console.log("Prev image for vela of the month updated")
      res.status(200).json({
        message: "Imagen previa para vela del mes actualizada correctamente",
      })
    }
  })
}

module.exports = {
  getProducts,
  addProduct,
  deleteProduct,
  getVelaOfTheMonth,
  updateVelaOfTheMonth,
  getPrevImageForVelaOfTheMonth,
  setPrevImageForVelaOfTheMonth,
}
