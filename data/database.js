const mysql = require("mysql2/promise")

const pool = mysql.createPool({
    host:"localhost",
    database:"mychama",
    user:"root",
    password:"kaboi"
    
})

module.exports = pool