const Sequelize  = require('sequelize')

const fields = {
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
    }
}

const options = {
    timestamps: true,
    underscored: true,
    paranoid: false,
    freezeTableName: true,
    tableName: 'users'
}

const User = sequelize.define('user', fields, options)

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
.catch(err => console.log(err))

module.exports = User