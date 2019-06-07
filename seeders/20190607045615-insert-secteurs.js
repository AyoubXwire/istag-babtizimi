'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('secteurs', [
            {
                code: 'NTIC',
                name: `Technologies de l'information`,
                description: `Le Maroc est conscient du fait que l’usage des technologies de l’information est un facteur essentiel pour l’émergence de la société du savoir et peut activement contribuer au développement humain, à l’amélioration de la cohésion sociale et à la croissance de l’économie nationale.`
            },
            {
                code: 'AGC',
                name: `Administration Gestion et Commerce`,
                description: `Les nouvelles tendances de l’économie mondiale montrent que les métiers du Tertiaire prennent une place de plus en plus importante dans le système de production en général en vue d’une plus grande productivité.`
            },
            {
                code: 'TH',
                name: `Textile et Habillement`,
                description: `L’industrie du Textile et de l’Habillement occupe une place stratégique dans l’industrie nationale de transformation aussi bien sur le plan des emplois et des exportations que sur le plan de l’équilibre socio-économique du pays.`
            }
        ], {})
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('secteurs', null, {})
    }
}