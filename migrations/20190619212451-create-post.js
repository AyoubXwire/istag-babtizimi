'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('posts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            type: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'types', key: 'id' }
            },
            pending: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            user: {
                type: Sequelize.STRING,
                allowNull: false,
                references: { model: 'users', key: 'username' }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('posts');
    }
};