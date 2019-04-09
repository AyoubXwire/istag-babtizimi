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
        command = `SELECT p.id, title, content, p.created_at, username
        FROM posts p JOIN users u ON p.user_id = u.id
        WHERE title LIKE ?
        ORDER BY p.id DESC`
        params = [`%${req.query.search}%`]
    } else {
        command = `SELECT p.id, title, content, p.created_at, username
        FROM posts p JOIN users u ON p.user_id = u.id
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
    const command = `INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)`
    const params = [req.body.title, req.body.content, req.user.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error

            res.redirect('/actualites')
            connection.release()
        })
    })
})

router.get('/:id', (req, res) => {
    const command = `SELECT p.id, title, content, p.created_at, username
    FROM posts p JOIN users u ON p.user_id = u.id
    WHERE p.id = ?`
    const params = [req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw err

        connection.query(command, params, (error, rows) => {
            if(error) throw err
            let post = rows[0]

            post.created_at = prettyDateTime(post.created_at)
            res.render('actualite', { post })
            connection.release()
        })
    })
})

router.get('/delete/:id', isOwer, (req, res) => {
    const command = `DELETE FROM posts WHERE id = ?`
    const params = [req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw err

        connection.query(command, params, (error, rows) => {
            if(error) throw err
            
            res.redirect('/actualites')
            connection.release()
        })
    })
})

module.exports = router