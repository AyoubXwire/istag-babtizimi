const express  = require('express')
const router   = express.Router()

const pool = require('../config/pool')
const { previewString, prettyDateTime } = require('../helpers/display')
const { isAuth } = require('../helpers/auth')
const { isOwer } = require('../helpers/power')

router.get('/', (req, res) => {
    let command
    let params = []

    if(req.query.search) {
        command = `SELECT p.id, title, content, p.created_at, p.user_id, username
        FROM posts p JOIN users u ON p.user_id = u.id
        WHERE pending = false AND title LIKE ?
        ORDER BY p.id DESC`
        params = [`%${req.query.search}%`]
    } else {
        command = `SELECT p.id, title, content, p.created_at, p.user_id, username
        FROM posts p JOIN users u ON p.user_id = u.id
        WHERE pending = false
        ORDER BY p.id DESC`
    }

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
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
    let command = `INSERT INTO posts (title, content, pending, user_id) VALUES (?, ?, ?, ?);`
    let params = []

    if(req.user.power > 1) {
        params = [req.body.title, req.body.content, false, req.user.id]
    } else {
        params = [req.body.title, req.body.content, true, req.user.id]
    }

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error

            if(req.files) {
                console.log(req.files)
                if(Array.isArray(req.files.document)) {
                    const files = req.files.document
                    files.forEach(file => {
                        let command = `INSERT INTO files (post_id, name) VALUES (?, ?);`
                        let params = [rows.insertId, file.name]
        
                        file.mv('public/uploads/' + file.name, error => {
                            if(error) throw error
                    
                            connection.query(command, params, (error, rows) => {
                                if(error) throw error
                            })
                        })
                    })
                } else {
                    const file = req.files.document
                    let command = `INSERT INTO files (post_id, name) VALUES (?, ?);`
                    let params = [rows.insertId, file.name]
    
                    file.mv('public/uploads/' + file.name, error => {
                        if(error) throw error
                
                        connection.query(command, params, (error, rows) => {
                            if(error) throw error
                        })
                    })
                }
            }

            res.redirect('/actualites')
            connection.release()
        })
    })
})

router.get('/:id', (req, res) => {
    const command = `SELECT p.id, title, content, p.created_at, username, u.id AS user_id
    FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?;
    SELECT id, name FROM files WHERE post_id = ?`
    const params = [req.params.id, req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
            
            let post = rows[0][0]
            let files = rows[1]

            post.created_at = prettyDateTime(post.created_at)
            
            res.render('actualite', { post, files })
            connection.release()
        })
    })
})

router.get('/delete/:id', isOwer, (req, res) => {
    const command = `DELETE FROM files WHERE post_id = ?;
    DELETE FROM posts WHERE id = ?;`
    const params = [req.params.id, req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
            
            res.redirect('/actualites')
            connection.release()
        })
    })
})

router.get('/update/:id', isAuth, (req, res) => {
    let command = `SELECT id, title, content FROM posts WHERE id = ?;
    SELECT id, name FROM files WHERE post_id = ?`
    let params = [req.params.id, req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
            let post = rows[0][0]
            let files = rows[1]

            res.render('editor', { post, files })
            connection.release()
        })
    })
})

router.post('/update/:id', isOwer, (req, res) => {
    const command = `Update posts SET title = ?, content = ? WHERE id = ?;`
    const params = [req.body.title, req.body.content, req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error

            if(req.files) {
                console.log(req.files)
                if(Array.isArray(req.files.document)) {
                    const files = req.files.document
                    files.forEach(file => {
                        let command = `INSERT INTO files (post_id, name) VALUES (?, ?);`
                        let params = [req.params.id, file.name]
        
                        file.mv('public/uploads/' + file.name, error => {
                            if(error) throw error
                    
                            connection.query(command, params, (error, rows) => {
                                if(error) throw error
                            })
                        })
                    })
                } else {
                    const file = req.files.document
                    let command = `INSERT INTO files (post_id, name) VALUES (?, ?);`
                    let params = [req.params.id, file.name]
    
                    file.mv('public/uploads/' + file.name, error => {
                        if(error) throw error
                
                        connection.query(command, params, (error, rows) => {
                            if(error) throw error
                        })
                    })
                }
            }

            res.redirect('/actualites')
            connection.release()
        })
    })
})

module.exports = router