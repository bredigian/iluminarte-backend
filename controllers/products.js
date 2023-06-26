const db = require("../db/db_connection")
const { URL } = require("../constants/api")

//GET PRODUCTS
const getProducts = (req, res) => {
  const query = "SELECT * FROM velas"
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error to get products: ", error)
      res.status(500).send("Error to get products")
    } else {
      const data = result.map((product) => {
        const imagesUrl = JSON.parse(product.IMAGENES)
        const imagesArray = imagesUrl.map((img) => {
          const nameImg = img[Object.keys(img)[0]]
          return {
            ...img,
            url: `${URL}/data/velas/${nameImg}.jpg`,
          }
        })
        return {
          ...product,
          IMAGENES: imagesArray,
          ETIQUETAS: JSON.parse(product.ETIQUETAS),
        }
      })
      console.log("---- Products sent to client ----")
      res.status(200).json(data)
    }
  })
}

//ADD PRODUCT
const addProduct = (req, res) => {
  const { product } = req.body
  const productData = JSON.parse(product)
  const images = req.files
  const imagesWithColors = productData.colores.map((color, index) => {
    return {
      [color]: images[index]?.filename?.replace(/\.[^/.]+$/, "") || null,
    }
  })
  console.log(imagesWithColors)
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
      const productData = {
        ...result[0],
        IMAGENES: JSON.parse(result[0].IMAGENES),
      }
      const imagesArray = productData.IMAGENES.map((img) => {
        const nameImg = img[Object.keys(img)[0]]
        return {
          ...img,
          url: `${URL}/data/velas/${nameImg}.jpg`,
        }
      })
      const response = { ...productData, IMAGENES: imagesArray }
      res.status(200).json({ vela: response })
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

module.exports = {
  getProducts,
  addProduct,
  deleteProduct,
  getVelaOfTheMonth,
  updateVelaOfTheMonth,
}
