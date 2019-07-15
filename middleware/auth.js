const jwt = require('jsonwebtoken');
const config = require('config');

// next is the call back
module.exports = function(req,res,next){

    // Get token from the header
    const token = req.header('x-auth-token');

    //Check if no token 
    if(!token){
        // 401 not authorised
        return res.status(401).json({ msg :'No token, authrozation denied'});
    }

    // Verify the token

    try {

        // Decode the JWT hash 
        const decoded= jwt.verify(token,config.get('jwtSecret'));
        // Assaign the req.user to parsed output
        req.user = decoded.user;

        next();
    } catch (error) {
        res.status(401).json({msg: 'token is not valid'});
    }

}