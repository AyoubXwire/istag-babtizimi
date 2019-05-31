const Sequelize  = require('sequelize')

const fields = {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    is_pending: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}

const options = {
    timestamps: true,
    tableName: 'posts'
}

const Post = sequelize.define('post', fields, options)

module.exports = Post