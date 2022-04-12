const express = require("express")

const bycrypt = require("bcryptjs")

const session = require("express-session")

const router = express.Router()

const db = require("../data/database")
const { append } = require("express/lib/response")

router.use(session({
    secret:"kaboi",
    resave:false,
    saveUninitialized:false
}))

router.get("/new_user_registration" , async(req,res)=>{

    res.render("users/signup")
})

router.get("/login" , async(req,res)=>{

    res.render("users/login")
})

router.post("/new_user_session" , async(req,res)=>{
    const [results] = await db.query(`SELECT * FROM users WHERE email = '${req.body.email}' `)

    if(!results){
        console.log("EMAIL NOT FOUND")

        return res.redirect("/login")
    }

    const passwordEqual = await bycrypt.compare(req.body.password , results[0].password)

    if(!passwordEqual){

        console.log("PASSWORD DID NOT MATCH")
        return res.render("users/login.ejs")
    }

    req.session.isAuthenticated = true

    res.redirect("/")

    
} )

router.post("/signup" , async(req,res)=>{
    console.log(req.body)

    const enteredEmail = req.body.email
    const enteredPassword = req.body.password

    if(!enteredEmail || !enteredEmail || enteredPassword< 6 || !enteredEmail.includes("@")){

        console.log("ALL DETAILS ARE REQUIRED")

        return res.redirect("new_user_registration")
    }


    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?" , [enteredEmail])

    if(existingUser.length > 0){

        console.log("USER EXISTS")

        return res.redirect("/new_user_registration")
    }else if(existingUser.length <=0 ){

        const hashedPassword = await bycrypt.hash(enteredPassword , 12)

        await db.query("INSERT INTO users(email , password)VALUES(?)" , [[enteredEmail , hashedPassword]])

        res.redirect("/login")

    }
})




module.exports = router