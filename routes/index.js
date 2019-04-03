const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')

const connection = require('../config/connection')

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/register', (req, res) => {
    bcrypt.genSalt(10)
    .then(salt => {
        bcrypt.hash(req.body.password, salt)
        .then(hash => {
            const command = 'INSERT INTO users (username, password) VALUES (?, ?)'
            const params = [req.body.username, hash]
            connection.query(command, params, (error, rows) => {
                if(error) throw error
                passport.authenticate('local')(req, res, () => {
                    res.redirect('/feed')
                })
            })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

module.exports = router