function isAuth(req,res,next){

    if(!req.session.isAuthenticated){

        return res.redirect("/login")
    }

    next()
}

module.exports = isAuth