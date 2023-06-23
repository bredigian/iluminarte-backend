const express = require("express")
const cors = require("cors")

const categoriesRoutes = require("./routes/categories")
const productsRoutes = require("./routes/products")
const authRoutes = require("./routes/auth")
const blogRoutes = require("./routes/blog")

require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/data", express.static("./data"))

//CONFIG ROUTES (MIDDLEWARE)
app.use("/categories", categoriesRoutes)
app.use("/products", productsRoutes)
app.use("/authentication", authRoutes)
app.use("/blog", blogRoutes)

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
