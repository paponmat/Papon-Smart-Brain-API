const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const image = require('./controllers/image');
const profileId = require('./controllers/profileId');

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

app.put('/image', (req,res) => { image.handleImage(req, res, db) });

app.get('/profile/:id', (req,res) => { profileId.handleProfileId(req, res, db) });

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`App is running on port ${PORT}`);
});