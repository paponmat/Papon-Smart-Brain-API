const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt');
const saltRounds = 10;
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

// console.log(postgres.select('*').from('users'))
// ;

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

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    // bcrypt.hash(password, saltRounds, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });
    // database.users.push({
    //     id: ~~database.users[database.users.length-1].id+1,
    //     name: name,
    //     email: email,
    //     password: password,
    //     entries: 0,
    //     joined: new Date(),
    // })
    db('users')
        .returning('*')
        .insert({
        email: email,
        name: name,
        joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('An error occurred while registering.'))
    
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++ ;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('not found');
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