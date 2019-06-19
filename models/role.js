'use strict';
module.exports = (sequelize, DataTypes) => {
    const role = sequelize.define('role', {
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
    role.associate = function (models) {
        // associations can be defined here
    };
    return role;
};