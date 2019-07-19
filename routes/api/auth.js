// User Js
const express = require('express');
// Useexpress Reouter
const router = express.Router();
// get hte middleware

const auth = require('../../middleware/auth');
// NOTE : add to second parameter to route to protect the route, and apply middleware

const User = require('../../models/User');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
// @route  GET api/auth
// @desc   Authentication route for finding user
// @access Public
router.get('/', auth, async (req,res) =>{

    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST api/auth
// @desc   Authentication route for finding user 
// @access Public
// router.get('/', (req,res) =>{
//     res.send('User Route');
// })

router.post('/',[
    check('email' , 'Please include a valid email').isEmail(),
    check('password' , 'Password is required').exists()
], async (req,res) =>{ 
    // Validate error which takes a req object 
    const errors= validationResult(req);

    if(!errors.isEmpty()){
        console.error(errors);
        return res.status(400).json({errors : errors.array()});
    }

    const { email, password } = req.body;

    // Destruct from req.body 
    try {
   
    // See if user exists
    let user = await User.findOne({ email });

    // IF THERE IS no user send back the error message
    if(!user){
        return res.status(400).json({errors : [ { message : 'Invalid Credentials'}]});
    }


    //Match the paswword with bcrypot

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({errors : [ { message : 'Invalid Credentials'}]});
    }

    const payload = {
        user:{
            id: user.id
        }
    }
    //get from config
    jwt.sign(
        payload, 
        config.get('jwtSecret'),
        {expiresIn: 360000},
        (err,token) => {
            if (err) throw err;
            res.json({token});
        }
    );

    //res.send('User Registered');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('User/ server error');
    }

})

// Export the router

module.exports = router;