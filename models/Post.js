const Sequelize  = require('sequelize')

const User = require('./User')

const Post = sequelize.define('post', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    type: {
        type: Sequelize.CHAR,
        allowNull: false,
    },
    isPending: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'username'
        }
    }
})

module.exports = Post