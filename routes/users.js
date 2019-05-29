const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')

const User = require('../models/User')

const { isAuth, isntAuth } = require('../helpers/middleware')
const { validateForm } = require('../helpers/functions')

router.get('/register', isntAuth, (req, res) => {
    res.render('register')
})

router.get('/login', isntAuth, (req, res) => {
    res.render('login')
})

router.post('/register', isntAuth, (req, res) => {
    // Validate user
    const validationMessage = validateForm(
        req.body.username,
        req.body.email,
        req.body.password,
        req.body.password2
    )
    
    if(validationMessage != 'valid') {
        req.flash('error', validationMessage)
        return res.redirect('/users/register')
    }

    // Register user
    bcrypt.genSalt(10)
    .then(salt => {
        bcrypt.hash(req.body.password, salt)
        .then(hash => {
            User.create({
                username: req.body.username,
                email: req.body.email,
                password: hash
            })
            .then(user => {
                passport.authenticate('local')(req, res, () => {
                    res.redirect('/')
                })
            })
            .catch(err => {
                req.flash('error', 'username exist deja')
                res.redirect('/users/register')
            })
        })
        .catch(err => res.render('error'))
    })
    .catch(err => res.render('error'))
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