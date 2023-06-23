const express = require("express")
const {
  addProduct,
  deleteProduct,
  updateVelaOfTheMonth,
  getVelaOfTheMonth,
  getProducts,
} = require("../controllers/products")
const router = express.Router()
const { uploadProductImages } = require("../config/multer")

//GET PRODUCTS
router.get("/", getProducts)

//ADD PRODUCT
router.post("/", uploadProductImages.array("images"), addProduct)

//DELETE PRODUCT
router.delete("/", deleteProduct)

//UPDATE VELA OF THE MONTH
router.put("/favorite", updateVelaOfTheMonth)

//GET VELA OF THE MONTH
router.get("/favorite", getVelaOfTheMonth)

module.exports = router
