const handleImage = async (req, res, db) => {
    const { id } = req.body;
    try {
        const updated  = await db('users')
            .where('id', id)
            .increment('entries', 1)
            .returning('entries');

        if (updated.length) {
            res.json(updated[0].entries);
        } else {
            res.status(400).json('Unable to update entry count');
        }
    } catch (error) {
        res.status(500).json('Internal server error');
    }
}

module.exports = {
    handleImage: handleImage
};