const { Sequelize } = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();

const connection = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME
});

module.exports = {
    connection
}