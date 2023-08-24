const handleProfileId = async (req, res, db) => {
    const { id } = req.params;
    try {
        const user = await db.select('*').from('users').where('id', id);
        
        if (user) {
            res.json(user[0]);
            console.log('Fetched user:', user);
        } else {
            res.status(404).json('User not found');
            console.log('Fetched user:', user);
        }
    } catch (error) {
        res.status(500).json('Internal server error');
        console.log('Fetched user:', user);
    }
}

module.exports = {
    handleProfileId: handleProfileId
};