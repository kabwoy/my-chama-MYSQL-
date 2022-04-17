const auth = function(req,res,next){

    if(req.session.user.isAdmin === 1){

        return next()


    }

    res.render("auth/noauth")


}

module.exports = auth

