const handleProfileId = async (req, res, db) => {
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
}

module.exports = {
    handleProfileId: handleProfileId
};