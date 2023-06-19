const mysql = require("mysql")
const db_config = require("./config/db_config")

const pool = mysql.createPool({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
})

//ENABLE CONNECTION WITH DATABASE
pool.getConnection((error, connection) => {
  if (error) {
    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed")
    }
    if (error.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections")
    }
    if (error.code === "ECONNREFUSED") {
      console.error("Database connection was refused")
    }
  }
  if (connection) connection.release()
  return
})

//CLOSE CONNECTION WITH DATABASE
process.on("SIGINT", () => {
  pool.end()
  console.log("Database connection closed")
  process.exit()
})

module.exports = pool
