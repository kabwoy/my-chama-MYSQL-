const express = require("express")
const isAdmin = require("../middlewares/isAdmin")
const isAuth = require("../middlewares/isAuth")
const usersRoutes = require("../routes/users")
const db = require("../data/database")
const { append } = require("express/lib/response")
const router = express.Router()

router.use(usersRoutes)

router.get("/groups" , async(req,res)=>{

    const [results] = await db.query("SELECT group_teams.* , categories.amount FROM group_teams INNER JOIN categories ON group_teams.category_id = categories.id ")

    res.render("groups/index" , {results})
})

router.use(isAuth)

router.get("/groups/new" ,  async(req, res)=>{
    const[result] = await db.query("SELECT * FROM categories" )
  
    res.render("groups/new" ,{result})
})

router.post("/groups" , async(req,res)=>{
    const data = [
        req.body.name,
        req.body.description,
        req.body.category
    ]

    const pushed = await db.query("INSERT INTO group_teams(name , description , category_id)VALUES(?)", [data]).then(()=>{

        console.log("Data added Successfuly")
    })

})

router.get("/groups/:id" , async(req,res)=>{
    console.log(req.params)
    const [items] = await db.query(`SELECT group_teams.* ,categories.amount AS category_amount FROM group_teams INNER JOIN categories ON group_teams.category_id = categories.id WHERE group_teams.id = ${req.params.id}`)
    res.render("groups/show.ejs" , {items})
})

router.get("/groups/:id/edit" , async(req,res)=>{
    const [categories] = await db.query("SELECT * FROM categories")
    const [results] = await db.query(`SELECT * FROM group_teams WHERE id = ${req.params.id}`)
    console.log(results)
    
    res.render("groups/edit" , {categories,results:results[0]})
})

router.put("/groups/:id" , async(req,res)=>{
    const data = [
        req.body.name,
        req.body.description,
        req.body.category,
        req.params.id
    ]
    console.log(req.body)
    await db.query(`UPDATE group_teams SET name = '${req.body.name}' , description = '${req.body.description}' , category_id = ${req.body.category}  WHERE id = ${req.params.id}`).then((data)=>{

        console.log(data)

    }).catch((err)=>{

        console.log(err.message)
    })


    res.redirect(`/groups/${req.params.id}`)
})

router.delete("/groups/:id" , async(req,res)=>{
    await db.query(`DELETE FROM group_teams WHERE id = ${req.params.id} `)

    res.redirect("/groups")
})
module.exports = router