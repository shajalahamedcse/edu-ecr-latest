require('dotenv').config()

module.exports = {
  development: {
    username: 'root',
    password: 'mypassword',
    database: 'example',
    host: '175.41.175.248',
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: process.env.DB_OPERATOR_ALIAS,
    timezone: 'Africa/Addis_Ababa',
  },
  staging: {
    username: process.env.STAGING_DB_USERNAME,
    password: process.env.STAGING_DB_PASSWORD,
    database: process.env.STAGING_DB_DATABASE,
    host: process.env.STAGING_DB_HOST,
    port: process.env.STAGING_DB_PORT,
    dialect: process.env.STAGING_DB_CONNECTION,
    operatorsAliases: process.env.STAGING_DB_OPERATOR_ALIAS,
    timezone: process.env.STAGING_DB_TIMEZONE,
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_DATABASE,
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    dialect: process.env.PROD_DB_CONNECTION,
    operatorsAliases: process.env.PROD_DB_OPERATOR_ALIAS,
    timezone: process.env.PROD_DB_TIMEZONE,
  },
}
