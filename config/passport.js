const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const connection = require('../config/connection')

module.exports = passport.use(
    new localStrategy({usernameField: 'username'}, (username, password, done) => {
        const command = 'SELECT * FROM users WHERE username = ?'
        const params = [username]
        connection.query(command, params, (error, rows) => {
            if(error) throw error
            if(rows.length === 0) {
                return done(null, false, { message: 'username unregistered' })
            }
            bcrypt.compare(password, rows[0].password)
            .then(isMatch => {
                if(isMatch) {
                    return done(null, rows[0])
                } else {
                    return done(null, false, { message: 'password incorrect' })
                }
            })
            .catch(err => console.log(err))
        })
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})
    
passport.deserializeUser((id, done) => {
    const command = 'SELECT * FROM users WHERE id = ?'
    const params = [id]
    connection.query(command, params, (error, rows) => {
        if(error) throw error
        done(null, rows[0])
    })
})