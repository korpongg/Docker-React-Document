const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Sequelize = require('sequelize');


const handleLogin = async (req, res) => {
    console.log('handleLogin called');
    const { userid, pass } = req.body;
    if (!userid || !pass) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        // Find user by username using Sequelize
        //console.log('handleLogin called1:', User);
        const foundUser = await User.findOne({ 
            where: { 
                userid: userid,
                [Sequelize.Op.or]: [
                    { deleteAt: { [Sequelize.Op.gt]: new Date() } }, // deleteAt > current date
                    { deleteAt: null }, // deleteAt is NULL
                ],
            },
        });
        if (!foundUser) {
            //return res.status(404).json({ 'message': 'User หรือ รหัสผ่านผิด'});
            return res.sendStatus(401); // Unauthorized
        }
        
        // Evaluate password using bcrypt
        console.log('handleLogin called3:');
        console.log('Comparing password...From:',foundUser.userid);
        let match; 
        try {
            match = await bcrypt.compare(pass, foundUser.password);
            console.log('Password compared:', match);
        } catch (error) {
            console.error('Error during bcrypt comparison:', error);
        }

        // try {
        //     const match = await bcrypt.compare(pass, foundUser.password);  // added await here
        //     console.log('handleLogin called5:', match);
        // } catch (error) {
        //     console.error('Error during bcrypt comparison:', error);
        // }

        //console.log('handleLogin called5:', match);
        if (match) {
            const role = Object.values(foundUser.role).filter(Boolean);

            // Create JWTs
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "userid": foundUser.userid,
                        "role": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            const refreshToken = jwt.sign(
                { "userid": foundUser.userid },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            // Save refreshToken with the current user using Sequelize
            foundUser.refreshToken = refreshToken;
            await foundUser.save();

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            // Send authorization role and access token to the user
            res.json({ role, accessToken });
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'An error occurred.' + error.message });
    }
}

module.exports = { handleLogin };