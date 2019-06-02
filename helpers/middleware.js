const Post = require('../models/Post')

module.exports = {
    isAuth: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next()
        }
        req.flash('error', 'Veuillez vous connecter pour publier')
        res.redirect('/users/login')
    },

    isntAuth: (req, res, next) => {
        if(!req.isAuthenticated()) {
            return next()
        }
        req.flash('error', 'Veuillez vous deconnecter')
        res.redirect('/')
    },

    isAdmin: (req, res, next) => {
        if(req.user && req.user.power === 1) {
            return next()
        }
        req.flash('error', `vous n'etes pas autorisé`)
        return res.redirect('/')
    },

    isMaster: (req, res, next) => {
        if(req.user && req.user.power === 2) {
            return next()
        }
        req.flash('error', `vous n'etes pas autorisé`)
        return res.redirect('/')
    },

    isMasterOrAdmin: (req, res, next) => {
        if(req.user && req.user.power > 0) {
            return next()
        }
        req.flash('error', `vous n'etes pas autorisé`)
        return res.redirect('/')
    },

    isOwner: (req, res, next) => {
        Post.findByPk(req.params.id)
        .then(post => {
            // Check existence
            if(!post && !req.user) {
                req.flash('error', `Publication introuvable ou autorisations insuffisantes`)
                return res.redirect('/')
            }

            // Check ownership
            if(req.user.username === post.username) {
                return next()
            }

            req.flash('error', `vous n'etes pas autorisé`)
            return res.redirect('/')
        })
        .catch(err => console.log(err))
    },

    isOwnerOrMasterOrAdmin : (req, res, next) => {
        if(req.user && req.user.power > 0) {
            return next()
        }

        Post.findByPk(req.params.id)
        .then(post => {
            // Check existence
            if(!post && !req.user) {
                req.flash('error', `Publication introuvable ou autorisations insuffisantes`)
                return res.redirect('/')
            }

            // Check ownership
            if(req.user.username === post.username) {
                return next()
            }

            req.flash('error', `vous n'etes pas autorisé`)
            return res.redirect('/')
        })
        .catch(err => console.log(err))
    },

    isntPending: (req, res, next) => {
        Post.findByPk(req.params.id)
        .then(post => {
            // Check existence
            if(!post) {
                req.flash('error', `Publication introuvable ou autorisations insuffisantes`)
                return res.redirect('/')
            }
            
            // Check pending
            if(post.is_pending !== 1) {
                return next()
            }

            req.flash('error', `Publication introuvable ou autorisations insuffisantes`)
            return res.redirect('/')
        })
        .catch(err => console.log(err))
    }
}