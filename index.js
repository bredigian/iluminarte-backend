const express = require("express")
const cors = require("cors")

const { PORT, URL_FRONT } = require("./constants/api")
const categoriesRoutes = require("./routes/categories")
const productsRoutes = require("./routes/products")
const authRoutes = require("./routes/auth")
const blogRoutes = require("./routes/blog")

require("dotenv").config()

const app = express()

app.use(cors())
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", URL_FRONT)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  next()
})
app.use(express.json())
app.use("/data", express.static("./data"))

//CONFIG ROUTES (MIDDLEWARE)
app.use("/categories", categoriesRoutes)
app.use("/products", productsRoutes)
app.use("/authentication", authRoutes)
app.use("/blog", blogRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})
