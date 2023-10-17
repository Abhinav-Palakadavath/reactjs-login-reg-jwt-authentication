const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken')

const { check, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 9091;

app.use(cors());
app.use(express.json());
const db = mysql.createConnection({    
    host: "localhost",    
    user: "root",    
    password: "",    
    database: "signup"})
app.post('/signup', (req, res) => {    
    const sql = "INSERT INTO login (name,email,password) VALUES (?)";    
    const values = [        
        req.body.name,        
        req.body.email,        
        req.body.password    
    ]    
    db.query(sql, [values], (err, data) => {        
        if(err) {            
            return res.json("Error");        
        }        
        return res.json(data);    
    })
})

const verifyJwt = (req, res, next) => {
    const token = req.headers["access-token"];
    if(!token){
        return res.json("We need token, please provode it for next time")
    }else{
        jwt.verify(token, "jwtSecretKey" , (err, decoded) => {
            if(err){
                res.json("Not authenticated")
            }else{
                req.userId = decoded.id;
                next();
            }
           
        })
    }
}

app.get('/checkauth', verifyJwt ,(req, res) => {
    return res.json("Authenticated")
})

app.post('/login',[    
    check('email', "Emaill length error").isEmail().isLength({min: 10, max:30})  
    ], (req, res) => {    
        const sql = "SELECT * FROM login WHERE email = ? AND password = ?";    
        db.query(sql, [req.body.email,req.body.password ], (err, data) => {
            const errors = validationResult(req);        
            if(!errors.isEmpty()) {            
                return res.json(errors);        
            } else {            
                if(err) {                
                    return res.json("Error");            
                }            
                if(data.length > 0) { 
                    const id = data[0].id;
                    const token = jwt.sign({id}, "jwtSecretKey" , {expiresIn: 300})               
                    return res.json({Login: true, token, data});            
                } else {                
                    return res.json("Faile");            
                }        
            }            
        })
    })
app.listen(port, ()=> {    
    console.log(`Server is running on port ${port}`);
})