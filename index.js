// Libraries
const express = require('express');
const mysql = require('mysql');

// Setting Database
const connection = mysql.createConnection({
  host     : 'bi3kldvtr4fcfel9zrc9-mysql.services.clever-cloud.com',
  user     : 'uuxmvtjt9m2ywspo',
  password : 'psK7PG8o0BtAoATPcukr',
  database: 'bi3kldvtr4fcfel9zrc9'
});

// Initialize
const app = express();

// Port
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.get('/',(req,res)=>{
    res.json({
        message:"It works"
    })
})

app.post('/api/authenticate',(req,res)=>{
    const sql = `SELECT * FROM administradores WHERE idadministrador = '${req.body.username}' AND idadministrador = '${req.body.password}'`;
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        if(result.length > 0){
            res.json({
                authentication:true
            });
        }
        else{
            res.json({
                authentication:false
            })
        }
    });
})

// Listener
app.listen(PORT,console.log(`Server running on port ${PORT}`));