const express = require("express")
const methodOverride = require("method-override")
const session = require("express-session")
const path = require("path")
const db = require("./data/database")
const groupRoutes = require("./routes/groups")
const memberRoutes = require("./routes/members")
const usersRoutes = require("./routes/users")
const isAuth = require("./middlewares/isAuth")

const app = express()

app.set('views', path.join(__dirname, '/views'))
app.set("view engine" , "ejs")
app.use(express.static("public"))

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(express.static('images'))
app.use(usersRoutes)

app.use(async function(req,res,next){

    const user = req.session.user

    const isAuth = req.session.isAuthenticated

    if(!user || !isAuth){

        return next()
    }

    const[results] = await db.query(`SELECT * FROM users WHERE id = '${user.id}' `)
    const ans = results[0].isAdmin

    res.locals.isAdmin = ans

    res.locals.isAuth = isAuth

    res.locals.id = user.id

   
    next()
})
app.use(groupRoutes)
app.use(memberRoutes)


app.use(session({
    secret:"kaboi",
    resave:false,
    saveUninitialized:false
}))

app.use(isAuth)



app.get("/" ,  (req,res)=>{


   res.render("home")


})



app.listen(3000)