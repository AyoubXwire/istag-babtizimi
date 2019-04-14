module.exports = {
    isAuth: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next()
        }
        res.redirect('/users/login')
    },
    isntAuth: (req, res, next) => {
        if(!req.isAuthenticated()) {
            return next()
        }
        res.redirect('/')
    },
    isAdmin: (req, res, next) => {
        if(req.user && req.user.power > 1) {
            return next()
        }
        req.flash('error', `vous n'etes pas autorisé`)
        return res.redirect('/actualites')
    },
    isOwner: (req, res, next) => {
        let command = `SELECT user_id FROM posts WHERE id = ?`
        let params = [req.params.id]
        
        pool.getConnection((error, connection) => {
            if(error) throw error

            connection.query(command, params, (error, rows) => {
                if(error) throw error
                
                connection.release()
                const post = rows[0]
                
                // Check existence
                if(post === undefined && !req.user) {
                    req.flash('error', `Publication introuvable ou autorisations insuffisantes`)
                    return res.redirect('/actualites')
                }

                // Check ownership
                if(req.user.id === post.user_id) {
                    return next()
                }

                req.flash('error', `vous n'etes pas autorisé`)
                return res.redirect('/actualites')
            })
        })
    },
    isOwnerOrAdmin : (req, res, next) => {
        if(req.user && req.user.power > 1) {
            return next()
        }
        let command = `SELECT user_id FROM posts WHERE id = ?`
        let params = [req.params.id]
        
        pool.getConnection((error, connection) => {
            if(error) throw error

            connection.query(command, params, (error, rows) => {
                if(error) throw error
                
                connection.release()
                const post = rows[0]
                
                // Check existence
                if(post === undefined && !req.user) {
                    req.flash('error', `Publication introuvable ou autorisations insuffisantes`)
                    return res.redirect('/actualites')
                }
                
                // Check ownership
                if(req.user.id === post.user_id) {
                    return next()
                }

                req.flash('error', `vous n'etes pas autorisé`)
                return res.redirect('/actualites')
            })
        })
    },
    isntPending: (req, res, next) => {
        let command = `SELECT pending FROM posts WHERE id = ?`
        let params = [req.params.id]
        
        pool.getConnection((error, connection) => {
            if(error) throw error

            connection.query(command, params, (error, rows) => {
                if(error) throw error
                
                connection.release()
                const post = rows[0]
                
                // Check existence
                if(post === undefined) {
                    req.flash('error', `Publication introuvable ou autorisations insuffisantes`)
                    return res.redirect('/actualites')
                }
                
                // Check pending
                if(post.pending !== 1) {
                    return next()
                }

                req.flash('error', `Publication introuvable ou autorisations insuffisantes`)
                return res.redirect('/actualites')
            })
        })
    }
}