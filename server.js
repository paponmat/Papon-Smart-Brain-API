const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const image = require('./controllers/image');

const app = express();
app.use(express.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1', //localhost
      port : 5432,
      user : 'postgres',
      password : 'test',
      database : 'smart-brain'
    }
});

app.get('/', (req , res) => {
    res.send('API is working');
})

app.post('/signin', (req,res) => { signin.handleSignin(req, res, db, bcrypt) });

app.post('/register', (req,res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await db.select('*').from('users').where('id', id).first();
        
        if (user) {
            res.json(user[0]);
        } else {
            res.status(404).json('User not found');
        }
    } catch (error) {
        res.status(500).json('Internal server error');
    }
});

app.put('/image', (req,res) => { image.handleImage(req, res, db) });

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`App is running on port ${PORT}`);
});