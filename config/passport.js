const passport      = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt        = require('bcrypt')

module.exports = passport.use(
    new localStrategy({usernameField: 'username'}, (username, password, done) => {
        const command = `SELECT * FROM users WHERE username = ?`
        const params = [username]

        pool.getConnection((error, connection) => {
            if(error) throw err

            connection.query(command, params, (error, rows) => {
                if(error) throw err
    
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
                connection.release()
            })
        })
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})
    
passport.deserializeUser((id, done) => {
    const command = `SELECT * FROM users WHERE id = ?`
    const params = [id]
    
    pool.getConnection((error, connection) => {
        if(error) throw error

        connection.query(command, params, (error, rows) => {
            if(error) throw error
            
            done(null, rows[0])
            connection.release()
        })
    })
})