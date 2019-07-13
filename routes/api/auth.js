// User Js
const express = require('express');
// Useexpress Reouter
const router = express.Router();

// @route  GET api/auth
// @desc   Test Route
// @access Public
router.get('/', (req,res) =>{
    res.send('Auth Route');
})

// Export the router

module.exports = router;