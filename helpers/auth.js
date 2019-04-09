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
    }
}