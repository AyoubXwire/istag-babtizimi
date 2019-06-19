module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        username: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            references: { model: 'roles', key: 'id' }
        }
    }, {});
    user.associate = function (models) {
        // associations can be defined here
    };
    return user;
};