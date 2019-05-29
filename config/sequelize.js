const Sequelize  = require('sequelize')

const options = {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

global.sequelize = new Sequelize('babtizimi', 'root', '1234', options)

// Load models
const User = require('../models/User')
const Post = require('../models/Post')
const File = require('../models/File')
const Secteur = require('../models/Secteur')
const Filiere = require('../models/Filiere')
const Module = require('../models/Module')

// Associations
Post.belongsTo(User, { foreignKey: 'username' })
File.belongsTo(Post, { foreignKey: 'post_id' })
Filiere.belongsTo(Secteur, { foreignKey: 'secteur_code' })
Module.belongsTo(Filiere, { foreignKey: 'filiere_code' })

sequelize.sync()
.then(/*() => initializeData()*/ )
.catch(err => console.log(err))

const initializeData = () => {
    const secteurs = [
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
    ]
    
    Secteur.bulkCreate(secteurs)
    .then(() => {
        const filieres = [
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
            },
        ]
        
        Filiere.bulkCreate(filieres)
        .then(() => {
            const modules = [
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
            ]
            
            Module.bulkCreate(modules)
            .then(() => console.log('Synced'))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}