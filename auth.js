const jwt = require('jsonwebtoken');
const jwt_secret = require('./config').jwt

module.exports =(limitedAccessId = null) => (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Assuming "Bearer TOKEN"
        
        jwt.verify(token, jwt_secret, (err, user) => {
	    console.log('ID: resul', limitedAccessId, user.userId, (limitedAccessId ? user !== limitedAccessId : false))
            //if (err || limitedAccessId ? user.userId !== limitedAccessId : false) {
		if(err){            
    return res.sendStatus(403); // Forbidden
            }
            req.user = user; // Attach user info to the request
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};
