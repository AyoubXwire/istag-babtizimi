const express  = require('express')
const router   = express.Router()
const fs = require('fs')

const User = require('../models/User')
const Post = require('../models/Post')
const File = require('../models/File')

const { previewString, prettyDateTime, escapeHtml } = require('../helpers/functions')
const { isAuth, isOwnerOrMasterOrAdmin, isntPending } = require('../helpers/middleware')

router.get('/', (req, res) => {
    let where = {}
    if(req.query.search) {
        where = {
            where: {
                is_pending: false,
                type: 'A',
                title: { [Op.like]: '%${req.query.search}%' }
            }
        }
    } else {
        where = {
            where: { is_pending: false, type: 'A' }
        }
    }

    Post.findAll(where, { order: [['created_at', 'DESC']] })
    .then(posts => {
        posts.forEach(post => {
            post.content = previewString(post.content)
            post.created_at = prettyDateTime(post.created_at)
        })
        
        res.render('actualites', { posts })
    })
    .catch(err => res.render('error', { err }))
})

router.get('/new', isAuth, (req, res) => {
    res.render('editor')
})

router.post('/new', isAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        username: req.user.username,
        is_pending: req.user.power === 0,
        type: 'A'
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
                        .catch(err => res.render('error', { err }))
                    })
                })
            } else {
                const file = req.files.document
                const prefix = Math.floor(Math.random() * 1000000) + '-'
                file.name = prefix + file.name

                file.mv('public/uploads/' + file.name, err => {
                    if(err) return res.render('error', { err })
            
                    File.create({ post_id: post.id, name: file.name })
                    .catch(err => res.render('error', { err }))
                })
            }
        }

        if(req.user.power > 0) {
            req.flash('success', 'Publication envoyée')
        } else {
            req.flash('success', 'Suggestion publiée, un administrateur doit la confirmer')
        }

        res.redirect('/actualites')
    })
    .catch(err => res.render('error', { err }))
})

router.get('/:id', isntPending, (req, res) => {
    const command = `SELECT p.id, title, content, p.created_at, username, u.id AS user_id
    FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?;
    SELECT id, name FROM files WHERE post_id = ?`
    const params = [req.params.id, req.params.id]
    
    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })
        
        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })
            
            let post = rows[0][0]
            let files = rows[1]
            if (!post) {
                req.flash('error', 'Publication introuvable')
                return res.redirect('/actualites')
            }
            post.created_at = prettyDateTime(post.created_at)
            post.content = escapeHtml(post.content)
            
            res.render('actualite', { post, files })
            connection.release()
        })
    })
})

router.get('/update/:id', isAuth, isOwnerOrMasterOrAdmin, (req, res) => {
    let command = `SELECT id, title, content FROM posts WHERE id = ?;
    SELECT id, name FROM files WHERE post_id = ?`
    let params = [req.params.id, req.params.id]

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })
            let post = rows[0][0]
            let files = rows[1]

            res.render('editor', { post, files })
            connection.release()
        })
    })
})

router.post('/update/:id', isAuth, isOwnerOrMasterOrAdmin, (req, res) => {
    const command = `Update posts SET title = ?, content = ? WHERE id = ?;`
    const params = [req.body.title, req.body.content, req.params.id]

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })

            if(req.files) {
                if(Array.isArray(req.files.document)) {
                    const files = req.files.document
                    files.forEach(file => {
                        const prefix = Math.floor(Math.random() * 1000000) + '-'
                        file.name = prefix + file.name

                        let command = `INSERT INTO files (post_id, name) VALUES (?, ?);`
                        let params = [req.params.id, file.name]
        
                        file.mv('public/uploads/' + file.name, err => {
                            if(err) return res.render('error', { err })
                    
                            connection.query(command, params, (err, rows) => {
                                if(err) return res.render('error', { err })
                            })
                        })
                    })
                } else {
                    const file = req.files.document
                    const prefix = Math.floor(Math.random() * 1000000) + '-'
                    file.name = prefix + file.name

                    let command = `INSERT INTO files (post_id, name) VALUES (?, ?);`
                    let params = [req.params.id, file.name]
    
                    file.mv('public/uploads/' + file.name, err => {
                        if(err) return res.render('error', { err })
                
                        connection.query(command, params, (err, rows) => {
                            if(err) return res.render('error', { err })
                        })
                    })
                }
            }

            req.flash('success', 'Publication modifiée')
            res.redirect('/actualites')
            connection.release()
        })
    })
})

router.get('/delete/:id', isAuth, isOwnerOrMasterOrAdmin, (req, res) => {
    const command = `DELETE FROM files WHERE post_id = ?;
    DELETE FROM posts WHERE id = ?;`
    const params = [req.params.id, req.params.id]

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })
            
            req.flash('success', 'Publication supprimée')
            res.redirect('/actualites')
            connection.release()
        })
    })
})

router.get('/delete-file/:id', isAuth, isOwnerOrMasterOrAdmin, (req, res) => {
    const command = `SELECT name FROM files WHERE id = ?;`
    const params = [req.params.id]

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            let fileName = rows[0].name

            fs.unlink('public/uploads/' + fileName, (err) => {
                if(err) return res.render('error', { err })

                const command = `DELETE FROM files WHERE id = ?;`
                const params = [req.params.id]
                
                connection.query(command, params, (err, rows) => {
                    if(err) return res.render('error', { err })
        
                    req.flash('success', 'fichier supprimé')
                    res.redirect('/actualites')
                    connection.release()
        
                })
            })
        })
    })
})

module.exports = router