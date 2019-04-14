const express  = require('express')
const router   = express.Router()

const { previewString, prettyDateTime } = require('../helpers/functions')

router.get('/', (req, res) => {
    let command = `SELECT id, title, created_at, content
    FROM posts WHERE pending = ?
    ORDER BY id DESC LIMIT 5;
    SELECT id, code, nom, description FROM secteurs;
    SELECT id, apropos, num_filieres, num_formateurs, num_stagiaires FROM infos;`
    let params = [false]
    
    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
            let posts = rows[0]
            let secteurs = rows[1]
            let infos = rows[2][0]

            posts.forEach(post => {
                post.title = previewString(post.title)
                post.created_at = prettyDateTime(post.created_at)
            })

            res.render('index', { posts, secteurs, infos })
            connection.release()
        })
    })
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
    // nodemailer here
})

module.exports = router