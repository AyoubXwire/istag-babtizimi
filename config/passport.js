const passport      = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt        = require('bcrypt')

const User = require('../models/User')

module.exports = passport.use(
    new localStrategy({ usernameField: 'username' }, (username, password, done) => {
        User.findByPk(username)
        .then(user => {
            if(!user) return done(null, false, { message: 'username unregistered' })

            bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: 'password incorrect' })
                }
            })
            .catch(err => console.log(err))
        })
    })
)

passport.serializeUser((user, done) => {
    done(null, user.username)
})

passport.deserializeUser((username, done) => {
    User.findByPk(username)
    .then(user => done(null, user))
    .catch(err => console.log(err))
})