const Sequelize  = require('sequelize')

const fields = {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}

const options = {
    timestamps: false,
    underscored: true,
    paranoid: false,
    freezeTableName: true,
    tableName: 'modules'
}

const Module = sequelize.define('module', fields, options)

module.exports = Module