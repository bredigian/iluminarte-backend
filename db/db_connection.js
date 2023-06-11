const mysql = require("mysql")
const db_config = require("./config/db_config")

const connection = mysql.createConnection({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
})

//ENABLE CONNECTION WITH DATABASE
connection.connect((error) => {
  if (error) {
    console.error("Error to connect to database: \n", error)
  } else {
    console.log("Connected to database")
  }
})

//CLOSE CONNECTION WITH DATABASE
process.on("SIGINT", () => {
  connection.end()
  console.log("Database connection closed")
  process.exit()
})

module.exports = connection
