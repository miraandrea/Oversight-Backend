// Libraries
const express = require('express');

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

// Listener
app.listen(PORT,console.log(`Server running on port ${PORT}`));