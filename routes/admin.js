const express  = require('express')
const router   = express.Router()

const User = require('../models/User')
const Post = require('../models/Post')
const File = require('../models/File')

const { previewString, prettyDateTime } = require('../helpers/functions')
const { isAuth, isMasterOrAdmin } = require('../helpers/middleware')

router.get('/', isAuth, isMasterOrAdmin, (req, res) => {
    Promise.all([
        Post.count(),
        Post.count({ where: { is_pending: true } }),
        User.count({ where: { power: 0 } }),
        User.count({ where: { power: 1 } })
    ])
    .then(data => {
        let numPosts = data[0]
        let numPendingPosts = data[1]
        let numUsers = data[2]
        let numAdmins = data[3]

        res.render('admin/index', { numPosts, numUsers, numAdmins, numPendingPosts })
    })
    .catch(err => res.render('error', { err }))
})

router.get('/pending', isAuth, isMasterOrAdmin, (req, res) => {
    Post.findAll({ where: { is_pending: true } }, { order: [['created_at', 'DESC']] })
    .then(posts => {
        posts.forEach(post => {
            post.content = previewString(post.content)
            post.created_at = prettyDateTime(post.createdAt)
        })

        res.render('admin/pendings', { posts })
    })
    .catch(err => res.render('error', { err }))
})

router.get('/pending/:id', isAuth, isMasterOrAdmin, (req, res) => {
    Promise.all([
        Post.findByPk(req.params.id),
        File.findAll({ where: { post_id: req.params.id } })
    ])
    .then(data => {
        let post = data[0]
        let files = data[1]

        post.created_at = prettyDateTime(post.createdAt)

        res.render('admin/pending', { post, files })
    })
    .catch(err => res.render('error', { err }))
})

router.get('/pending/accepter/:id', isAuth, isMasterOrAdmin, (req, res) => {
    Post.update({ is_pending: false }, { where: { id: req.params.id } })
    .then(() => {
        res.redirect('/admin/pending')
    })
    .catch(err => res.render('error', { err }))
})

router.get('/pending/refuser/:id', isAuth, isMasterOrAdmin, (req, res) => {
    Post.destroy({ where: { id: req.params.id } })
    .then(() => {
        res.redirect('/admin/pending')
    })
    .catch(err => res.render('error', { err }))
})

router.get('/utilisateurs', isAuth, isMasterOrAdmin, (req, res) => {
    User.findAll()
    .then(users => {
        res.render('admin/utilisateurs', { users })
    })
    .catch(err => res.render('error', { err }))
})

router.get('/utilisateurs/to_admin/:username', isAuth, isMasterOrAdmin, (req, res) => {
    User.update({ power: 1 } ,{ where: { username: req.params.username } })
    .then(() => {
        res.redirect('/admin/utilisateurs')
    })
    .catch(err => res.render('error', { err }))
})

router.get('/utilisateurs/to_user/:username', isAuth, isMasterOrAdmin, (req, res) => {
    User.update({ power: 0 } ,{ where: { username: req.params.username } })
    .then(() => {
        res.redirect('/admin/utilisateurs')
    })
    .catch(err => res.render('error', { err }))
})

module.exports = router