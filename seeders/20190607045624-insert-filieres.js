'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('filieres', [
            {
                code: 'TDI',
                name: `Techniques de développement informatiques (TS)`,
                description: `description du filiere.`,
                secteur_code: 'NTIC'
            },
            {
                code: 'TRI',
                name: `Techniques des réseaux informatiques (TS)`,
                description: `description du filiere.`,
                secteur_code: 'NTIC'
            },
            {
                code: 'TMSIR',
                name: `Technicien en Maintenance et Systèmes Informatiques et Réseaux (T)`,
                description: `description du filiere.`,
                secteur_code: 'NTIC'
            },
            {
                code: 'TSGE',
                name: `Technicien Spécialisé en Gestion des Entreprises (TS)`,
                description: `description du filiere.`,
                secteur_code: 'AGC'
            },
            {
                code: 'TCE',
                name: `Technicien Comptable d’Entreprises (T)`,
                description: `description du filiere.`,
                secteur_code: 'AGC'
            },
            {
                code: 'TSB',
                name: `Technicien en Secrétariat Bureautique (T)`,
                description: `description du filiere.`,
                secteur_code: 'AGC'
            },
            {
                code: 'THP',
                name: `Techniques Habillement Production (T)`,
                description: `description du filiere.`,
                secteur_code: 'TH'
            },
            {
                code: 'THI',
                name: `Technique Habillement Industrialisation (T)`,
                description: `description du filiere.`,
                secteur_code: 'TH'
            },
            {
                code: 'TMI',
                name: `Technique Modélisme Industriel (T)`,
                description: `description du filiere.`,
                secteur_code: 'TH'
            },
            {
                code: 'TMMC',
                name: `Techniques Maintenance de Machines à Coudre (T)`,
                description: `description du filiere.`,
                secteur_code: 'TH'
            }
        ], {})
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('filieres', null, {})
    }
}