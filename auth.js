const jwt = require('jsonwebtoken');
const jwt_secret = require('./config').jwt

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Assuming "Bearer TOKEN"
        
        jwt.verify(token, jwt_secret, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user; // Attach user info to the request
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};