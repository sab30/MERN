// User Js
const express = require('express');
// Useexpress Reouter
const router = express.Router();
// get hte middleware

const auth = require('../../middleware/auth');
// NOTE : add to second parameter to route to protect the route, and apply middleware

const User = require('../../models/Users');
// @route  GET api/auth
// @desc   Test Route
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

// Export the router

module.exports = router;