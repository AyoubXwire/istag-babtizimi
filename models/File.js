const Sequelize  = require('sequelize')

const fields = {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}

const options = {
    timestamps: true,
    underscored: true,
    paranoid: false,
    freezeTableName: true,
    tableName: 'files'
}

const File = sequelize.define('file', fields, options)

module.exports = File