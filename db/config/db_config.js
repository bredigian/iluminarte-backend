require("dotenv").config()

const db_config = process.env.MYSQL_URL

module.exports = db_config
