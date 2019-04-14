const express  = require('express')
const router   = express.Router()

const { previewString, prettyDateTime } = require('../helpers/display')
const { isAuth, isAdmin } = require('../helpers/auth')

router.get('/', isAuth, isAdmin, (req, res) => {
    let command = `SELECT COUNT(id) AS numPosts FROM posts;
    SELECT COUNT(id) AS numUsers FROM users WHERE power = ?;
    SELECT COUNT(id) AS numAdmins FROM users WHERE power > ?;
    SELECT COUNT(id) AS numPendingPosts FROM posts WHERE pending = true;`
    let params = [1, 1]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
            let numPosts = rows[0][0].numPosts
            let numUsers = rows[1][0].numUsers
            let numAdmins = rows[2][0].numAdmins
            let numPendingPosts = rows[3][0].numPendingPosts

            res.render('administration', { numPosts, numUsers, numAdmins, numPendingPosts })
            connection.release()
        })
    })
})

router.get('/pending', isAuth, isAdmin, (req, res) => {
    let command = `SELECT p.id, title, content, p.created_at, username
    FROM posts p JOIN users u ON p.user_id = u.id
    WHERE pending = true
    ORDER BY p.id DESC`

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, (error, rows) => {
            if(error) throw error
            let posts = rows

            posts.forEach(post => {
                post.content = previewString(post.content)
                post.created_at = prettyDateTime(post.created_at)
            })
            
            res.render('pendings', { posts })
            connection.release()
        })
    })
})

router.get('/pending/:id', isAuth, isAdmin, (req, res) => {
    let command = `SELECT p.id, title, content, p.created_at, p.user_id, username
    FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?;
    SELECT id, name FROM files WHERE post_id = ?;`
    let params = [req.params.id, req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
            let post = rows[0][0]
            let files = rows[1]

            post.created_at = prettyDateTime(post.created_at)

            res.render('pending', { post, files })
            connection.release()
        })
    })
})

router.get('/pending/accepter/:id', isAuth, isAdmin, (req, res) => {
    let command = `UPDATE posts SET pending = false WHERE id = ?`
    let params = [req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error

            res.redirect('/administration/pending')
            connection.release()
        })
    })
})

router.get('/pending/refuser/:id', isAuth, isAdmin, (req, res) => {
    let command = `DELETE FROM posts WHERE id = ?`
    let params = [req.params.id]

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error

            res.redirect('/administration/pending')
            connection.release()
        })
    })
})

router.get('/utilisateurs', isAuth, isAdmin, (req, res) => {
    let command = `SELECT id, username, power from users`

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, (error, rows) => {
            if(error) throw error
            let users = rows

            res.render('utilisateurs', { users })
            connection.release()
        })
    })
})

router.get('/infos', isAuth, isAdmin, (req, res) => {
    let command = `SELECT id, apropos, num_filieres, num_formateurs, num_stagiaires FROM infos;`

    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, (error, rows) => {
            if(error) throw error
            let infos = rows[0]

            res.render('infos', { infos })
            connection.release()
        })
    })
})

module.exports = router