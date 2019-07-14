// User Js
const express = require('express');
// Useexpress Reouter
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
// Import UserModel
const User = require('../../models/Users');

// @route  GET api/users
// @desc   Test Route
// @access Public
// router.get('/', (req,res) =>{
//     res.send('User Route');
// })

router.post('/',[
    check('name' , 'Name is required').not().isEmpty(),
    check('email' , 'Please include a valid email').isEmail(),
    check('password' , 'Please enter a password with 6 or more chrachters').isLength({
        min:6
    })
], async (req,res) =>{ 
    // Validate error which takes a req object 
    const errors= validationResult(req);

    if(!errors.isEmpty()){
        console.error(errors);
        return res.status(400).json({errors : errors.array()});
    }

    const {name , email, password } = req.body;

    // Destruct from req.body 
    try {
   
    // See if user exists
    let user = await User.findOne({ email });

    if(user){
        return res.status(400).json({errors : [ { message : 'User already exist'}]});
    }

    //Get user gravatar
    // s(size): , r(rating):  d(default): 
    const avatar = gravatar.url({
        s:'200',
        r:'pg',
        d:'mm'
    });

    // Crate instance of the user;
     user = new User({name , email , password , avatar});

    // Encrypt password with bcrypt

    const salt = await bcrypt.genSalt(10);

    user.password  = await bcrypt.hash(password,salt);
    // Will Return a Promise 
    await user.save();

    //Return JWT 

    res.send('User Registered');
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('User/ server error');
    }

    res.send('User Route');
})




// Export the router

module.exports = router;