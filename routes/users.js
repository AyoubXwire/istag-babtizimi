const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')

const { isAuth, isntAuth } = require('../helpers/middleware')

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
                const command = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`
                const params = [req.body.username, req.body.email, hash]

                pool.getConnection((err, connection) => {
                    if (err) throw err

                    connection.query(command, params, (err, rows) => {
                        if (err) {
                            req.flash('error', 'username exist deja')
                            res.redirect('/users/register')
                        }

                        passport.authenticate('local')(req, res, () => {
                            connection.release()
                            return res.redirect('/')
                        })
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