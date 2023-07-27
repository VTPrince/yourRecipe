const express=require('express')
require('dotenv').config();
const { Pool } = require('pg');
const DATABASE_URL=process.env.DATABASE_URL
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const app=express()

// PostgreSQL database connection configuration
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required if using SSL (ElephantSQL)
  });
  
  // Middleware to parse JSON bodies
app.use(express.json());


function generateToken(user) {
    const token = jwt.sign({ id: user.uuid }, jwtSecretKey, { expiresIn: '1h' });
    return token;
  }



app.post('/app/register',(req,res)=>{
    const{username,password}=req.body;
    const uuid=uuidv4();
    bcrypt.hash(password,10,(err,hash)=>{
        if(err){
            console.log(err);
            return res.status(500).json({error:'Internal Server Error'});
        }
        
        const query = {
            text: 'INSERT INTO users (username, password_has, uuid) VALUES ($1, $2, $3)',
            values: [username, hash,uuid]
          };
          pool.query(query, (err, result) => {
            if(err){
                console.log(err)
                return
            }
            console.log(result);
          });

    });
})

app.post('/app/login',(req,res)=>{
    const{username,password}=req.body
    const query={
        text:'select * from users where username = $1 ',
        values: [username]
    };
    pool.query(query,(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({error:'Internal Server Error'});
        }
        if(!result){
            return res.status(404).json({error:'User not found'});
        }
        console.log(result)
        bcrypt.compare(password,result.rows[0].password_has,(err,row)=>{
            if(err){
                console.log(err);
                return res.status(500).json({error:'Internal Server Error in password'});
            }
            if(!row){
                return res.status(401).json({error:'Incorrect password'});
            }
            const token=generateToken(result)
            res.json({token})
        })
    })

})


app.get('/', (req, res) => {
    res.send('Hello NEW World!')
  })


const port = 3000
app.listen(port,()=>{
    console.log('Server is running on port 3000');
});