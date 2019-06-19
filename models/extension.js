'use strict';
module.exports = (sequelize, DataTypes) => {
    const extension = sequelize.define('extension', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, { timestamps: false });
    extension.associate = function (models) {
        // associations can be defined here
    };
    return extension;
};