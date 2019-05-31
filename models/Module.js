const Sequelize  = require('sequelize')

const fields = {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}

const options = {
    timestamps: false,
    tableName: 'modules'
}

const Module = sequelize.define('module', fields, options)

module.exports = Module