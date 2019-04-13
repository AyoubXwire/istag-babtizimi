const pool = require('../config/pool')

module.exports = {
    isAdmin: (req, res, next) => {
        if(req.user && req.user.power > 1) {
            return next()
        }
        res.redirect('/')
    },
    isOwer: (req, res, next) => {
        let command = `SELECT user_id FROM posts WHERE id = ?`
        let params = [req.params.id]
        
        pool.getConnection((error, connection) => {
            if(error) throw error

            connection.query(command, params, (error, rows) => {
                if(error) throw error
                
                let postOwner
                if(req.user)
                postOwner = rows[0].user_id
                connection.release()

                if(req.user && req.user.id === postOwner) {
                    return next()
                }
                res.redirect('/')
            })
        })
    }
}