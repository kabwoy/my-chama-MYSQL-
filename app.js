const express = require("express")
const methodOverride = require("method-override")
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
app.use(memberRoutes)
app.use(usersRoutes)


app.get("/" , (req,res)=>{

    if(req.session.isAuthenticated){

        return res.render("home")


    }else{

        res.render("users/401")
    }

  
})

app.listen(3000)