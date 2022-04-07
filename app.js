const express = require("express")
const methodOverride = require("method-override")
const path = require("path")
const groupRoutes = require("./routes/groups")

const app = express()

app.set('views', path.join(__dirname, '/views'))
app.set("view engine" , "ejs")

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(groupRoutes)


app.get("/" , (req,res)=>{

    res.render("home")
})

app.listen(3000)