const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data;
    }
};

const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    };
    const foundUser = usersDB.users.find(user => user.username === username);
    if (!foundUser) {
        return res.status(401).json({ 'message': 'Unauthorized' });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // create session or JWT
        res.status(200).json({ 'message': `User ${username} logged in successfully.` });
    } else {
        res.status(401).json({ 'message': 'Unauthorized' });
    }
};

module.exports = { handleLogin };