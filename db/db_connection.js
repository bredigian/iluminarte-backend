const mysql = require("mysql2")
const {
  MYSQL_HOST,
  MYSQL_DATABASE,
  MYSQL_CONNECTION_LIMIT,
  MYSQL_PASSWORD,
  MYSQL_USER,
  MYSQL_PORT,
} = require("./config/db_config")

const pool = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: MYSQL_PORT,
  connectionLimit: MYSQL_CONNECTION_LIMIT,
  // ssl: true,
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
  if (connection) {
    console.log("Connected successfully!")
    connection.release()
  }
  return
})

//CLOSE CONNECTION WITH DATABASE
process.on("SIGINT", () => {
  pool.end()
  console.log("Database connection closed")
  process.exit()
})

module.exports = pool
