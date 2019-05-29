const express  = require('express')
const router   = express.Router()

const Filiere = require('../models/Filiere')
const Module = require('../models/Module')

router.get('/', (req, res) => {
    let options = {}
    if(req.query.secteur) {
        options = { where: { secteur_code: req.query.secteur } }
    }

    Filiere.findAll(options)
    .then(filieres => {
        res.render('filieres', { filieres })
    })
    .catch(err => res.render('error', { err }))
})

router.get('/:code', (req, res) => {
    Promise.all([
        Filiere.findByPk(req.params.code),
        Module.findAll({ where: { filiere_code: req.params.code } })
    ])
    .then(data => {
        const filiere = data[0]
        let modules = data[1]

        res.render('filiere', { filiere, modules })
    })
    .catch(err => res.render('error', { err }))
})

module.exports = router