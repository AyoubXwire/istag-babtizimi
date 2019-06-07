'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [
            {
                username: 'webmaster',
                email: 'webmaster@gmail.com',
                password: '$2b$10$J4u0fWfKTycMbJ3y6tCV.uxb4yIAxPYtdh.ryXo079DuIHVCB52Me',
                power: 2,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                username: 'admin',
                email: 'admin@gmail.com',
                password: '$2b$10$g25kiAEGrCCV/sHtRFTak.nk..ktucYlxwL6Z9iH8aMPltz/YtN36',
                power: 1,
                created_at: new Date(),
                updated_at: new Date()
            }
    ], {})
    },

    down: (queryInterface, Sequelize) => {
        // return queryInterface.bulkDelete('users', null, {})
    }
}
