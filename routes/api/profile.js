// User Js
const express = require('express');
// Useexpress Reouter
const router = express.Router();
const {check, validationResult} = require('express-validator');

const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');



// @route  GET api/profile/me
// @desc   Get cussrent users profile
// @access Private, token is required
router.get('/me', auth, async (req,res) =>{
    try {
        // Find the user by users id
        // Populate is used to bring in properties from other table
        const profile = await Profile.findOne({ user : req.user.id}).populate('user',
        ['name','avatar']);

        if(!profile){
            return res.status(400).json({ msg : 'Thers is no profile for htis user'})
        }
        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Profile/ server error');
    }
})


// @route  POST api/profile
// @desc   Create orr update a user profile
// @access Private, token is required

// Export the router
router.post('/', [
    auth , 
    [
        check('status' , 'Status is requierd').not().isEmpty(),
        check('skills' , 'Skills is requierd').not().isEmpty()
    ]
], async (req,res) =>{

    const errors= validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array()});
    }

    const {
    company,
    website,
    location,
    status,
    skills,
    bio,
    githubusername,
    youtube,
    twitter,
   facebook,
   linkedin,
  instagram,
 } = req.body; 

 // Build the profile object 

  const profileFields= {};
  profileFields.user = req.user.id;
  if(company) profileFields.company= company;
  if(website) profileFields.website= website;
  if(location) profileFields.location= location;
  if(status) profileFields.status= status;
  if(githubusername) profileFields.githubusername= githubusername;
  if(bio) profileFields.bio= bio;

  if(skills){
    profileFields.skills= skills.split(',').map(skill => skill.trim());
  }

  console.log(profileFields.skills);

  // Build social object 
  profileFields.social= {};
  if(youtube) profileFields.social.youtube = youtube;
  if(twitter) profileFields.social.twitter = twitter;
  if(facebook) profileFields.social.facebook = facebook;
  if(linkedin) profileFields.social.linkedin = linkedin;
  if(instagram) profileFields.social.instagram = instagram;

    try {    
        // Comes from the token 
        let profile = await Profile.findOne({ user : req.user.id});

        if(profile){
            // Update
            profile=  await Profile.findOneAndUpdate(
                {user : req.user.id  }, 
                {$set : profileFields},
                {new : true});

            return res.json(profile);
        }

        // Else Create a Profile
        profile = new Profile(profileFields);
        // Save on instance
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Profile/ POST server error');
    }
})


// @route  GET api/profile
// @desc   Get All Profiles
// @access Public, no token is required


router.get('/', async (req,res) => {
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('API/Profile/ GET server error');
    }
})




module.exports = router;