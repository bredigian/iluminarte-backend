const express = require("express")
const cors = require("cors")
require("dotenv").config()

const db = require("./db/db_connection")

const app = express()
app.use(cors())

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

app.get("/products", (req, res) => {
  const query = "SELECT * FROM products"
  db.query(query, function (error, result) {
    if (error) {
      console.error("Error to get products: ", error)
      res.status(500).send("Error to get products")
    } else {
      console.log(result)
      console.log("Products sent to client")
      res.status(200).json(result)
    }
  })
})
