const Sequelize  = require('sequelize')

const fields = {
    code: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}

const options = {
    timestamps: false,
    tableName: 'secteurs'
}

const Secteur = sequelize.define('secteur', fields, options)

module.exports = Secteur