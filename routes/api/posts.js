// User Js
const express = require('express');
// Useexpress Reouter
const router = express.Router();

// @route  GET api/posts
// @desc   Test Route
// @access Public
router.get('/', (req,res) =>{
    res.send('Posts Route');
})

// Export the router

module.exports = router;