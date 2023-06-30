const express = require("express")
const {
  addProduct,
  deleteProduct,
  updateVelaOfTheMonth,
  getVelaOfTheMonth,
  getProducts,
  getPrevImageForVelaOfTheMonth,
  setPrevImageForVelaOfTheMonth,
} = require("../controllers/products")
const router = express.Router()
const { uploadImages } = require("../config/multer")

//GET PRODUCTS
router.get("/", getProducts)

//ADD PRODUCT
router.post("/", uploadImages.array("images"), addProduct)

//DELETE PRODUCT
router.delete("/", deleteProduct)

//UPDATE VELA OF THE MONTH
router.put("/favorite", updateVelaOfTheMonth)

//GET VELA OF THE MONTH
router.get("/favorite", getVelaOfTheMonth)

router.get("/favorite/previmage", getPrevImageForVelaOfTheMonth)

router.post(
  "/favorite/previmage",
  uploadImages.single("image"),
  setPrevImageForVelaOfTheMonth
)

module.exports = router
