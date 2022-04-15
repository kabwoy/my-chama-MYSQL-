const express = require("express")
const methodOverride = require("method-override")
const session = require("express-session")
const path = require("path")
const groupRoutes = require("./routes/groups")
const memberRoutes = require("./routes/members")
const usersRoutes = require("./routes/users")


const app = express()

app.set('views', path.join(__dirname, '/views'))
app.set("view engine" , "ejs")
app.use(express.static("public"))

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(express.static('images'))
app.use(groupRoutes)
app.use(usersRoutes)
app.use(memberRoutes)


// app.use(function(req,res,next){

//     const user = req.session.user
//     const isAuth = req.session.isAuthenticated

//     if(!user.isAdmin === 1){

//         return next()
//     }

//     app.use(memberRoutes)

//     res.locals.isAuth = isAuth; 

//     res.locals.userDoc = user

//     next()


// })



app.use(session({
    secret:"kaboi",
    resave:false,
    saveUninitialized:false
}))

app.get("/" ,  (req,res)=>{

   

   res.render("home")

  
})

app.listen(3000)