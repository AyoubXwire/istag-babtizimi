const express  = require('express')
const router   = express.Router()
const Op = require('sequelize').Op
const fs = require('fs')

const Post = require('../models/Post')
const File = require('../models/File')

const { previewString, prettyDateTime, escapeHtml } = require('../helpers/functions')
const { isAuth, isOwnerOrMasterOrAdmin, isntPending } = require('../helpers/middleware')

router.get('/', (req, res) => {
    let options = {}
    if(req.query.search) {
        options = {
            where: {
                is_pending: false,
                type: 'E',
                title: { [Op.like]: `%${req.query.search}%` }
            },
            order: [['created_at', 'DESC']]
        }
    } else {
        options = {
            where: { is_pending: false, type: 'E' },
            order: [['created_at', 'DESC']]
        }
    }

    Post.findAll(options)
    .then(posts => {
        posts.forEach(post => {
            post.title = previewString(post.title)
            post.created_at = prettyDateTime(post.createdAt)
        })
        
        res.render('emplois', { posts })
    })
    .catch(err => console.log(err))
})

router.get('/new', isAuth, isOwnerOrMasterOrAdmin, (req, res) => {
    res.render('emplois/editor')
})

router.post('/new', isAuth, isOwnerOrMasterOrAdmin, (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        username: req.user.username,
        is_pending: req.user.power === 0,
        type: 'E'
    })
    .then(post => {
        if(req.files) {
            if(Array.isArray(req.files.document)) {
                const files = req.files.document
                files.forEach(file => {
                    const prefix = Math.floor(Math.random() * 1000000) + '-'
                    file.name = prefix + file.name

                    file.mv('public/uploads/' + file.name, err => {
                        if(err) return res.render('error', { err })
                
                        File.create({ post_id: post.id, name: file.name })
                        .catch(err => console.log(err))
                    })
                })
            } else {
                const file = req.files.document
                const prefix = Math.floor(Math.random() * 1000000) + '-'
                file.name = prefix + file.name

                file.mv('public/uploads/' + file.name, err => {
                    if(err) return res.render('error', { err })
            
                    File.create({ post_id: post.id, name: file.name })
                    .catch(err => console.log(err))
                })
            }
        }

        if(req.user.power > 0) {
            req.flash('success', 'Publication envoyée')
        } else {
            req.flash('success', 'Suggestion publiée, un administrateur doit la confirmer')
        }

        res.redirect('/emplois')
    })
    .catch(err => console.log(err))
})

router.get('/:id', isntPending, (req, res) => {
    Promise.all([
        Post.findByPk(req.params.id),
        File.findAll({ where : { post_id: req.params.id } })
    ])
    .then(data => {
        let post = data[0]
        let files = data[1]

        if (!post) {
            req.flash('error', 'Publication introuvable')
            return res.redirect('/emplois')
        }
        post.created_at = prettyDateTime(post.createdAt)
        post.content = escapeHtml(post.content)
        
        res.render('emplois/emploi', { post, files })
    })
    .catch(err => console.log(err))
})

router.get('/update/:id', isAuth, isOwnerOrMasterOrAdmin, (req, res) => {
    Promise.all([
        Post.findByPk(req.params.id),
        File.findAll({ where : { post_id: req.params.id } })
    ])
    .then(data => {
        let post = data[0]
        let files = data[1]

        res.render('emplois/editor', { post, files })
    })
    .catch(err => console.log(err))
})

router.post('/update/:id', isAuth, isOwnerOrMasterOrAdmin, (req, res) => {
    Post.update({
        title: req.body.title,
        content: req.body.content
    }, {
        where: { id: req.params.id }
    })
    .then(post => {
        if(req.files) {
            if(Array.isArray(req.files.document)) {
                const files = req.files.document
                files.forEach(file => {
                    const prefix = Math.floor(Math.random() * 1000000) + '-'
                    file.name = prefix + file.name
    
                    file.mv('public/uploads/' + file.name, err => {
                        if(err) return res.render('error', { err })
                
                        File.create({ post_id: req.params.id, name: file.name })
                        .catch(err => console.log(err))
                    })
                })
            } else {
                const file = req.files.document
                const prefix = Math.floor(Math.random() * 1000000) + '-'
                file.name = prefix + file.name

                file.mv('public/uploads/' + file.name, err => {
                    if(err) return res.render('error', { err })
            
                    File.create({ post_id: req.params.id, name: file.name })
                    .catch(err => console.log(err))
                })
            }
        }

        req.flash('success', 'Publication modifiée')
        res.redirect('/emplois')
    })
})

router.get('/delete/:id', isAuth, isOwnerOrMasterOrAdmin, (req, res) => {
    File.destroy({ where: { post_id: req.params.id } })
    .then(() => {
        Post.destroy({ where: { id: req.params.id } })
        .then(() => {
            req.flash('success', 'Publication supprimée')
            res.redirect('/emplois')
        })
    })
    .catch(err => console.log(err))
})

router.get('/delete-file/:id', isAuth, isOwnerOrMasterOrAdmin, (req, res) => {
    File.findByPk(req.params.id)
    .then(file => {
        let fileName = file.name

        fs.unlink('public/uploads/' + fileName, err => {
            if(err) return res.render('error', { err })

            File.destroy({ where: { id: req.params.id } })
            .then(() => {
                req.flash('success', 'fichier supprimé')
                res.redirect('/emplois')
            })
    
        })
    })
})

module.exports = router