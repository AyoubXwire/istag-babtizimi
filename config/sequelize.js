const Sequelize  = require('sequelize')
const keys = require('./keys')
const forceTables = false

const options = {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        underscored: true,
        paranoid: false,
        freezeTableName: true
    }
}

global.sequelize = new Sequelize(keys.dbName, keys.dbUser, keys.dbPassword, options)

// Load models
const User = require('../models/User')
const Post = require('../models/Post')
const File = require('../models/File')

// Associations
Post.belongsTo(User, { foreignKey: 'username' })
File.belongsTo(Post, { foreignKey: 'post_id' })

sequelize.sync({ force: forceTables })
.catch(err => console.log(err))
