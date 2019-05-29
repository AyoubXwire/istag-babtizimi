const Sequelize  = require('sequelize')

const options = {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

global.sequelize = new Sequelize('babtizimi', 'root', '1234', options)