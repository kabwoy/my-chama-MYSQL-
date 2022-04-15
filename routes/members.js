const express = require("express")
const multer = require('multer')
const users = require("./users")
const auth = require("./milddleware")
const db = require("../data/database")


const router = express.Router()

router.use(users)

const storageConfig = multer.diskStorage({

    destination:function(req,file,cb){
        cb(null , 'images/')
    },

    filename:function(req,file,cb){
        cb(null , Date.now() + '-' + file.originalname)
    }
})

const upload = multer({storage:storageConfig})

router.get("/members" , auth,  async(req, res)=>{


    const [members] = await db.query("SELECT * FROM members")

    res.render("members/index" , {members})

})

router.get("/members/new" , async(req, res)=>{
   
    const[groups] = await db.query("SELECT * FROM group_teams")
    
    res.render("members/new",{groups})

    
})

router.post("/members" ,upload.single('passport'), async(req,res)=>{

    let {fname , lname , phone , next_of_kin , group} = req.body
    let imageLocation = req.file
    console.log(imageLocation.path)
    await db.query("INSERT INTO members(first_name , last_name , phone , next_of_kin ,group_id , imagePath)VALUES(?)", [[fname , lname , phone , next_of_kin , group , imageLocation.path]]).then((data)=>{
        console.log("DATA INSERTED SUCCESSFULLY")

        res.redirect("/members")
    }).catch((err)=>{
        console.log(err.message)
    })

})

router.get("/members/:id" , async(req, res)=>{

    const[member] = await db.query(`SELECT members.* , group_teams.name AS group_name FROM members INNER JOIN group_teams ON members.group_id = group_teams.id WHERE members.id = ${req.params.id}`)

    res.render("members/show" , {member:member[0]})
})

router.get("/members/:id/edit" , async(req,res)=>{

    console.log(req.session)
    const [member] = await db.query(`SELECT * FROM members WHERE id = ${req.params.id}`)
    const[groups] = await db.query("SELECT * FROM group_teams")

    res.render("members/edit" ,{groups ,member:member[0] })
})

router.put("/members/:id" , async(req,res)=>{
    const {fname , lname , phone , next_of_kin , group} = req.body
    await db.query(`UPDATE members SET first_name='${fname}' , last_name='${lname}' , phone='${phone}' , next_of_kin='${next_of_kin}' , group_id='${group}' WHERE id = ${req.params.id}`)

    res.redirect(`/members/${req.params.id}`)
})

router.delete("/members/:id" , async(req, res)=>{

    await db.query(`DELETE FROM members WHERE id = ${req.params.id} `)

    res.redirect("/members")
})


module.exports = router