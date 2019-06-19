'use strict';
module.exports = (sequelize, DataTypes) => {
    const type = sequelize.define('type', {
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
    type.associate = function (models) {
        // associations can be defined here
    };
    return type;
};