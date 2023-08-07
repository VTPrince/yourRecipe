const express=require('express')
require('dotenv').config();
const { Pool } = require('pg');
const DATABASE_URL=process.env.DATABASE_URL
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const cors = require('cors');

const app=express()

// PostgreSQL database connection configuration
const pool = new Pool({
    connectionString: 'postgres://yfspobum:nvHvuSTH08YaLH6pMUhL6KXi9flf_KL6@john.db.elephantsql.com/yfspobum'
    // ssl: { rejectUnauthorized: false }, // Required if using SSL (ElephantSQL)
  });
  
  // Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.options('*', cors({
    allowedHeaders: ["Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization","Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT","Access-Control-Allow-Origin", "*"]
  }));

function generateToken(user) {
    // console.log(user.rows[0].uuid)
    const token = jwt.sign({ id: user.rows[0].uuid }, jwtSecretKey, { expiresIn: '1h' });
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
            // console.log(result);
            res.json({message:'user created'})
            return
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
            // console.log(result.uuid)
            res.json({token})
        })
    })

})


app.get('/test', async (req, res) => {
    try {
      // Perform a test query to the database
      const query = {
        text: 'SELECT * FROM users LIMIT 1', // Replace "users" with your actual table name
      };
      const result = await pool.query(query);
  
      // Return the result as a JSON response
      res.json(result.rows);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get('/', (req, res) => {
    res.send('Hello NEW World!')
  })


const port = 7000
app.listen(port,()=>{
    console.log('Server is running on port 7000');
});