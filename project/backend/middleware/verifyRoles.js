const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
        const token = authHeader.split(' ')[1];

        try {
            // Verify the token and check its expiration
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            if (decodedToken.exp < Date.now() / 1000) {
                // Token has expired
                return res.sendStatus(401);
            }

            const userRoles = decodedToken.UserInfo ? decodedToken.UserInfo.role.map(Number) : [];
            const rolesArray = [...allowedRoles];

            const result = userRoles.some(role => rolesArray.includes(role));
            //console.log('Is result:', result);

            if (!result) return res.sendStatus(401);
            next();
        } catch (error) {
            console.error('Error verifying token:', error);
            return res.sendStatus(401);
        }
    }
}

module.exports = verifyRoles;




// const isAdmin = userRoles.includes('3'); // Check if 'Admin' role is present
// You can now use the 'isAdmin' variable in your code
// console.log('Is Admin:', isAdmin);
//const result = userRoles.map(role => rolesArray.includes(role)).find(val => val === true);
// Check if userRoles array includes 'Admin'