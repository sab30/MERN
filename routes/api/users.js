// User Js
const express = require('express');
// Useexpress Reouter
const router = express.Router();
const {check, validationResult} = require('express-validator');

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
], (req,res) =>{ 
    // Validate error which takes a req object !erros.isEmpty()
    const errors= validationResult(req);

    if(errors){
        return res.status(400).json({errors : errors.array()});
    }
    console.log(req.body);
    res.send('User Route');
})




// Export the router

module.exports = router;