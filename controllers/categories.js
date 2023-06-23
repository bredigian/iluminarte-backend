const db = require("../db/db_connection")

//GET CATEGORIES
const getCategories = (req, res) => {
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
}

module.exports = {
  getCategories,
}
