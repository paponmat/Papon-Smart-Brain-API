const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const image = require('./controllers/image');
const profile = require('./controllers/profile');
const clarifai = require('./controllers/image');

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

app.get('/', (req , res) => { res.send('API is working'); });

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt); });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt); });

app.put('/image', (req, res) => { image.handleImage(req, res, db); });

app.post('/clarifai' , (req, res) => { image.handleClarifai(req, res); } )

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`App is running on port ${PORT}`);
});

console.log(process.env.PORT);

// const DATABASE_URL = process.env.DATABASE_URL;
// app.listen(DATABASE_URL, ()=> {
//     console.log(`App is running on port ${DATABASE_URL}`);
// });