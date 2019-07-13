// User Js
const express = require('express');
// Useexpress Reouter
const router = express.Router();

// @route  GET api/users
// @desc   Test Route
// @access Public
router.get('/', (req,res) =>{
    res.send('User Route');
})

// Export the router

module.exports = router;