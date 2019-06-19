'use strict';
module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'types', key: 'id' }
        },
        pending: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false,
            references: { model: 'users', key: 'username' }
        }
    }, {});
    post.associate = function (models) {
        // associations can be defined here
    };
    return post;
};