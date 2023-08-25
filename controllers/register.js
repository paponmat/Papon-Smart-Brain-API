const handleRegister = async (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    const isEmailValid= (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }
    
    try {
        
        if ( !email || !name || !password || !isEmailValid(email)) {
            return res.status(400).json('Incorrect form submission');
        }

        // Check if the email already exists in the 'login' table
        const existingUser = await db('login').where('email', email);
        if (existingUser.length > 0) {
            console.log("Email already exists"); // Debug log
            return res.status(400).json('Email already exists');
        }

        // Hash the password using bcrypt
        const saltRounds = 10; // Define the number of salt rounds for bcrypt       
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
}

module.exports = {
    handleRegister: handleRegister
};