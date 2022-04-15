const auth = function(req,res,next){

    if(req.session.user.isAdmin === 1){


        console.log("ADMIN")

        next()


    }else{

        res.render("auth/noauth")


    }

   

    


}

module.exports = auth

