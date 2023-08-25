const handleSignin = async (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    const isEmailValid= (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    try {
        if ( !email || !password || !isEmailValid(email)) {
            return res.status(400).json('Incorrect form submission');
        }

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
}

module.exports = {
    handleSignin: handleSignin
};