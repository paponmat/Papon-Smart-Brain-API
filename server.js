const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt');
const knex = require('knex');

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

db.select('*').from('users').then(data => {
    console.log(data);
});

const app = express();
app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date(),
        } , 
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date(),
        } 
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com',
        }
    ]
}

app.get('/', (req , res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    // // Load hash from your password DB.
    // bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    //     // result == true
    // });
    // bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    //     // result == false
    // });


    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            // res.json('success');
            res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
    
})

app.post('/register', async (req, res) => {
    const { email, name, password } = req.body;
    
    try {
        const saltRounds = 10; // Define the number of salt rounds for bcrypt
        
        // Hash the password using bcrypt
        const hashFromBcrypt = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });

        // Start a transaction
        await db.transaction(async trx => {
            // Insert hashed password and email into 'login' table
            const login = await db('login')
                .returning('*')
                .insert({
                    hash: hashFromBcrypt,
                    email: email
                })
                .transacting(trx);
            
            // Retrieve the registered email
            const loginEmail = login[0].email;
            
            // Insert user information into 'users' table
            const user = await db('users')
                .returning('*')
                .insert({
                    email: loginEmail,
                    name: name,
                    joined: new Date()
                })
                .transacting(trx);

            if (user.length > 0 && login.length) {
                res.json(user[0]);
            } else {
                res.status(404).json('Your information cannot be registered');
            }
        });
    } catch (error) {
        res.status(400).json('An error occurred while registering.');
    }
});

app.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await db.select('*').from('users').where('id', id);
        
        if (user.length > 0) {
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
        const entries = await db('users').where('id', id)
        .increment('entries', 1)
        .returning('entries');
        if (entries.length > 0) {
            res.json(entries[0].entries);
        }
    } catch (error) {
        res.status(400).json('Unable to get entries');
    }
})

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user

*/