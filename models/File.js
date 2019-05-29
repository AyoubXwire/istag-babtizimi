const Sequelize  = require('sequelize')

const Post = require('./Post')

const File = sequelize.define('file', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: 'id'
        }
    }
})

module.exports = File