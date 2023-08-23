const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt');
const knex = require('knex');

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

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const data = await db.select('email', 'hash')
            .from('login')
            .where('email', email);
        
        if (data.length > 0) {
            const isValid = await bcrypt.compare(password, data[0].hash);
            
            if (isValid) {
                const user = await db.select('*').from('users').where('email', email);
                if (user.length > 0) {
                    res.json(user[0]);
                } else {
                    res.status(400).json('Unable to get user');
                }
            } else {
                res.status(400).json('Invalid credentials');
            }
        } else {
            res.status(400).json('Invalid credentials');
        }
    } catch (err) {
        res.status(500).json('Error processing request');
    }
});

app.post('/register', async (req, res) => {
    const { email, name, password } = req.body;
    
    try {
        const saltRounds = 10; // Define the number of salt rounds for bcrypt
        
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Start a transaction
        await db.transaction(async trx => {
            // Insert hashed password and email into 'login' table
            const login = await db('login')
                .returning('email')
                .insert({
                    hash: hashedPassword,
                    email: email
                })
                .transacting(trx);
            
            // Insert user information into 'users' table
            const user = await db('users')
                .returning('*')
                .insert({
                    email: login[0].email,
                    name: name,
                    joined: new Date()
                })
                .transacting(trx);

            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(500).json('Registration failed');
            }
        });
    } catch (error) {
        res.status(400).json('An error occurred while registering.');
    }
});

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


app.put('/image', async (req, res) => {
    const { id } = req.body;
    try {
        const updated  = await db('users')
            .where('id', id)
            .increment('entries', 1)
            .returning('entries');

        if (updated.length) {
            res.json(updated [0].entries);
        } else {
            res.status(400).json('Unable to update entry count');
        }
    } catch (error) {
        res.status(500).json('Internal server error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`App is running on port ${PORT}`);
});