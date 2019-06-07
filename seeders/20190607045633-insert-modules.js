'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('modules', [
            { name: `arabe`, filiere_code: `TDI` },
                { name: `francais`, filiere_code: `TDI` },
                { name: `anglais`, filiere_code: `TDI` },
                { name: `C#`, filiere_code: `TDI` },
                { name: `algorithme`, filiere_code: `TDI` },
                { name: `database`, filiere_code: `TDI` },
                { name: `backend`, filiere_code: `TDI` },
                { name: `frontend`, filiere_code: `TDI` },
                { name: `entreprenariat`, filiere_code: `TDI` },
                { name: `emploi`, filiere_code: `TDI` }
        ], {})
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('modules', null, {})
    }
}