const express  = require('express')
const router   = express.Router()

const User = require('../models/User')
const Post = require('../models/Post')
const Secteur = require('../models/Secteur')

const { previewString, prettyDateTime } = require('../helpers/functions')

router.get('/', (req, res, next) => {
    Promise.all([
        Post.findAll(
            { where: { is_pending: false, type: 'A' } },
            { order: [['created_at', 'DESC']] },
            { limit: 5 }
        ),
        Secteur.findAll(),
        User.count({ where: { power: 0 } }),
        User.count({ where: { power: 1 } })
    ])
    .then(data => {
        let posts = data[0]
        let secteurs = data[1]
        let nombreUtilisateurs = data[2]
        let nombreAdministrateurs = data[3]

        posts.forEach(post => {
            post.title = previewString(post.title)
            post.created_at = prettyDateTime(post.created_at)
        })

        res.render('index', { posts, secteurs, nombreUtilisateurs, nombreAdministrateurs })
    })
    .catch(err => res.render('error', { err }))
})

router.get('/inscription', (req, res) => {
    res.render('inscription')
})

router.get('/reglement', (req, res) => {
    res.render('reglement')
})

router.get('/apropos', (req, res) => {
    res.render('apropos')
})

router.get('/contact', (req, res) => {
    res.render('contact')
})

router.post('/email', (req, res) => {
    
})

router.get('/empty', (req, res) => {
    res.render('empty')
})

module.exports = router