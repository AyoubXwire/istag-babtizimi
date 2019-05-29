const express  = require('express')
const router   = express.Router()
const fs = require('fs')

const { previewString, prettyDateTime, escapeHtml } = require('../helpers/functions')
const { isAuth, isOwnerOrMasterOrAdmin, isntPending } = require('../helpers/middleware')

router.get('/', (req, res) => {
    let command = ''
    let params = []

    if(req.query.search) {
        command = `SELECT p.id, title, content, p.created_at, p.user_id, username
        FROM posts p JOIN users u ON p.user_id = u.id
        WHERE pending = false AND post_type = 1 AND title LIKE ?
        ORDER BY p.id DESC`
        params = [`%${req.query.search}%`]
    } else {
        command = `SELECT p.id, title, content, p.created_at, p.user_id, username
        FROM posts p JOIN users u ON p.user_id = u.id
        WHERE pending = false AND post_type = 1
        ORDER BY p.id DESC`
    }

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })
            let posts = rows

            posts.forEach(post => {
                post.content = previewString(post.content)
                post.created_at = prettyDateTime(post.created_at)
            })
            
            res.render('actualites', { posts })
            connection.release()
        })
    })
})

router.get('/new', isAuth, (req, res) => {
    res.render('editor')
})

router.post('/new', isAuth, (req, res) => {
    let command = `INSERT INTO posts (title, content, user_id, pending, post_type) VALUES (?, ?, ?, ?, ?);`
    let params = [req.body.title, req.body.content, req.user.id, 1]
    
    params.push(req.user.power === 1)
    
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
                        let params = [rows.insertId, file.name]
        
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
                    let params = [rows.insertId, file.name]
    
                    file.mv('public/uploads/' + file.name, err => {
                        if(err) return res.render('error', { err })
                
                        connection.query(command, params, (err, rows) => {
                            if(err) return res.render('error', { err })
                        })
                    })
                }
            }

            if(req.user.power > 1) {
                req.flash('success', 'Publication envoyée')
            } else {
                req.flash('success', 'Suggestion publiée, un administrateur doit la confirmer')
            }

            res.redirect('/actualites')
            connection.release()
        })
    })
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