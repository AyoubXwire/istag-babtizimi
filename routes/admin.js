const express  = require('express')
const router   = express.Router()

const { previewString, prettyDateTime } = require('../helpers/functions')
const { isAuth, isAdmin } = require('../helpers/middleware')

router.get('/', isAuth, isAdmin, (req, res) => {
    let command = `SELECT COUNT(id) AS numPosts FROM posts;
    SELECT COUNT(id) AS numUsers FROM users WHERE power = ?;
    SELECT COUNT(id) AS numAdmins FROM users WHERE power > ?;
    SELECT COUNT(id) AS numPendingPosts FROM posts WHERE pending = true;`
    let params = [1, 1]

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })
            let numPosts = rows[0][0].numPosts
            let numUsers = rows[1][0].numUsers
            let numAdmins = rows[2][0].numAdmins
            let numPendingPosts = rows[3][0].numPendingPosts

            res.render('admin/index', { numPosts, numUsers, numAdmins, numPendingPosts })
            connection.release()
        })
    })
})

router.get('/pending', isAuth, isAdmin, (req, res) => {
    let command = `SELECT p.id, title, content, p.created_at, username
    FROM posts p JOIN users u ON p.user_id = u.id
    WHERE pending = true
    ORDER BY p.id DESC`

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, (err, rows) => {
            if(err) return res.render('error', { err })
            let posts = rows

            posts.forEach(post => {
                post.content = previewString(post.content)
                post.created_at = prettyDateTime(post.created_at)
            })
            
            res.render('admin/pendings', { posts })
            connection.release()
        })
    })
})

router.get('/pending/:id', isAuth, isAdmin, (req, res) => {
    let command = `SELECT p.id, title, content, p.created_at, p.user_id, username
    FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?;
    SELECT id, name FROM files WHERE post_id = ?;`
    let params = [req.params.id, req.params.id]

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })
            let post = rows[0][0]
            let files = rows[1]

            post.created_at = prettyDateTime(post.created_at)

            res.render('admin/pending', { post, files })
            connection.release()
        })
    })
})

router.get('/pending/accepter/:id', isAuth, isAdmin, (req, res) => {
    let command = `UPDATE posts SET pending = false WHERE id = ?`
    let params = [req.params.id]

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })

            res.redirect('/admin/pending')
            connection.release()
        })
    })
})

router.get('/pending/refuser/:id', isAuth, isAdmin, (req, res) => {
    let command = `DELETE FROM posts WHERE id = ?`
    let params = [req.params.id]

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })

            res.redirect('/admin/pending')
            connection.release()
        })
    })
})

router.get('/utilisateurs', isAuth, isAdmin, (req, res) => {
    let command = `SELECT id, username, email, power from users`

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, (err, rows) => {
            if(err) return res.render('error', { err })
            let users = rows

            res.render('admin/utilisateurs', { users })
            connection.release()
        })
    })
})

router.get('/utilisateurs/to_admin/:id', isAuth, isAdmin, (req, res) => {
    let command = `UPDATE users SET power = 2 WHERE id = ?;`
    let params = req.params.id

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })
            
            res.redirect('/admin/utilisateurs')
            connection.release()
        })
    })
})

router.get('/utilisateurs/to_user/:id', isAuth, isAdmin, (req, res) => {
    let command = `UPDATE users SET power = 1 WHERE id = ?;`
    let params = req.params.id

    pool.getConnection((err, connection) => {
        if(err) return res.render('error', { err })

        connection.query(command, params, (err, rows) => {
            if(err) return res.render('error', { err })
            
            res.redirect('/admin/utilisateurs')
            connection.release()
        })
    })
})

router.get('/sql', (req, res) => {
    res.render('admin/sql')
})

router.post('/sql', (req, res) => {
    let command = req.body.query
    let params = []

    pool.getConnection((err, connection) => {
        if(err) console.log(err)

        connection.query(command, params, (err, rows) => {
            if(err) console.log(err)
            
            res.send(rows)
            connection.release()
        })
    })
})

module.exports = router