const Sequelize  = require('sequelize')

const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    power: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
})

User.findOrCreate({
    where: {
        username: 'webmaster'
    },
    defaults: {
        username: 'webmaster',
        email: 'webmaster@gmail.com',
        password: '$2b$10$J4u0fWfKTycMbJ3y6tCV.uxb4yIAxPYtdh.ryXo079DuIHVCB52Me',
        power: 2
    }
})
.then(() => console.log('webmaster created'))
.catch(err => console.log(err))

module.exports = User