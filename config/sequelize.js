const Sequelize  = require('sequelize')
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

global.sequelize = new Sequelize('babtizimi', 'root', '1234', options)

// Load models
const User = require('../models/User')
const Post = require('../models/Post')
const File = require('../models/File')
const Secteur = require('../models/Secteur')
const Filiere = require('../models/Filiere')
const Module = require('../models/Module')

// Associations
Post.belongsTo(User, { foreignKey: 'username' })
File.belongsTo(Post, { foreignKey: 'post_id' })
Filiere.belongsTo(Secteur, { foreignKey: 'secteur_code' })
Module.belongsTo(Filiere, { foreignKey: 'filiere_code' })

sequelize.sync({ force: forceTables })
.catch(err => console.log(err))
