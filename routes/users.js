const express  = require('express')
const router   = express.Router()
const bcrypt   = require('bcrypt')
const passport = require('passport')

const pool = require('../config/pool')
const { isAuth, isntAuth } = require('../helpers/auth')

router.get('/register', isntAuth, (req, res) => {
    res.render('register')
})

router.get('/login', isntAuth, (req, res) => {
    res.render('login')
})

router.post('/register', isntAuth, (req, res) => {
    bcrypt.genSalt(10)
    .then(salt => {
        bcrypt.hash(req.body.password, salt)
        .then(hash => {
            const command = `INSERT INTO users (username, password) VALUES (?, ?)`
            const params = [req.body.username, hash]

            pool.getConnection((error, connection) => {
                if(error) throw err
        
                connection.query(command, params, (error, rows) => {
                    if(error) throw err
        
                    passport.authenticate('local')(req, res, () => {
                        res.redirect('/')
                    })
                    connection.release()
                })
            })
        })
        .catch(err => { throw err })
    })
    .catch(err => { throw err })
})

router.post('/login', isntAuth, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    successFlash: true,
    failureFlash: true
}))

router.get('/logout', isAuth, (req, res) => {
    req.logOut()
    res.redirect('/users/login')
})

module.exports = router