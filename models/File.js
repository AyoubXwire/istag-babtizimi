'use strict';
module.exports = (sequelize, DataTypes) => {
    const file = sequelize.define('file', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        extension: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'extensions', key: 'id' }
        },
        post: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'posts', key: 'id' }
        },
    }, {});
    file.associate = function (models) {
        // associations can be defined here
    };
    return file;
};