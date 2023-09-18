require("dotenv").config()

const db_config = {
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  MYSQL_CONNECTION_LIMIT: process.env.MYSQL_CONNECTION_LIMIT,
  MYSQL_PORT: process.env.MYSQL_PORT,
}

module.exports = db_config
