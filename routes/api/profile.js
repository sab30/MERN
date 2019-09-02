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
/**
 *   {
    "company":"Milvik",
    "website":"google.com",
    "location":"bangalore",
    "status":"Developer",
    "skills":"HTML,CSS,ReactJS",
    "bio":"I'm a Full Stack developer.",
    "githubusername":"sab30",
    "youtube":"youtube.com",
    "twitter":"twitter.com",
    "facebook":"sabarishkashyap",
    "linkedin":"sabarishkashyap@hotmail.com",
    "instagram":"sabarishkashyap"
 }
 */
// Export the router
router.post('/', [
    auth , 
    [
        check('status' , 'Status is required').not().isEmpty(),
        check('skills' , 'Skills is required').not().isEmpty()
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
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user id
// @access Public, no token is required



router.get('/user/:user_id', async (req,res) => {
    try {
        const profile = await Profile.findOne({ user : req.params.user_id}).populate('user',['name','avatar']);

        if(!profile)  return res.status(400).json({ msg :'Profile not found'});

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(400).json({ msg :'Profile not found'});
        }
        res.status(500).send('GET server error');
    }
})



// @route  DELETE api/profile
// @desc   DELETE Profiles, users & posts
// @access Private


router.delete('/', auth, async (req,res) => {
    try {
        // @todo - Remove users posts
        // Remove Profile
        // console.log(req.user.id);
        await Profile.findOneAndRemove({ user : req.user.id});
        // Remove the user
        await User.findOneAndRemove({ _id : req.user.id});
        
        res.json( {msg :' User Remover or Deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});
// @route  put api/profile/experience
// @desc   add profile expreience
// @access Private
router.put('/experience', 
[
    auth,
    [
        check('title' , 'Title is required').not().isEmpty(),
        check('company' , 'Company is required').not().isEmpty(),
        check('from' , 'From Date is required').not().isEmpty(),
    ]
]   , async (req,res) => {

    const errors= validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array()});
    }

    const { title, company, location, from , to , current, description } = req.body;
    // This will create a object with data exists
    const newExp= {title, company, location, from , to , current, description};


    try {
        // Fetch the profile
        const profile= await Profile.findOne({ user : req.user.id});
        //console.log(profile);
        profile.experience.unshift(newExp);
        // Remove the user
        await profile.save();
        
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});


// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete profile expreience
// @access Private


router.delete('/experience/:exp_id', auth , async (req,res) => {
    try {   
        const profile= await Profile.findOne({ user : req.user.id});
        //console.log(profile);
        // Get Remove index
        const removeIndex = profile.experience.map(item => item.id ).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex,1);
        // Remove the user
        await profile.save();
        
        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});


// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
    '/education',
    [
      auth,
      [
        check('school', 'School is required')
          .not()
          .isEmpty(),
        check('degree', 'Degree is required')
          .not()
          .isEmpty(),
        check('fieldofstudy', 'Field of study is required')
          .not()
          .isEmpty(),
        check('from', 'From date is required')
          .not()
          .isEmpty()
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(newEdu);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  
  // @route    DELETE api/profile/education/:edu_id
  // @desc     Delete education from profile
  // @access   Private
  //router.delete('/education/:edu_id', auth, async (req, res) => {
    //try {
      //const profile = await Profile.findOne({ user: req.user.id });
  
      // Get remove index
      //const removeIndex = profile.education
        //.map(item => item.id)
        //.indexOf(req.params.edu_id);
  /*
      profile.education.splice(removeIndex, 1);
  
      await profile.save();
  
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  */
  
  router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
      const eduIds = foundProfile.education.map(edu => edu._id.toString());
      // if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /education/5
      const removeIndex = eduIds.indexOf(req.params.edu_id);
      if (removeIndex === -1) {
        return res.status(500).json({ msg: "Server error" });
      } else {
        // theses console logs helped me figure it out
        /*   console.log("eduIds", eduIds);
        console.log("typeof eduIds", typeof eduIds);
        console.log("req.params", req.params);
        console.log("removed", eduIds.indexOf(req.params.edu_id));
   */ foundProfile.education.splice(
          removeIndex,
          1,
        );
        await foundProfile.save();
        return res.status(200).json(foundProfile);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server error" });
    }
  });
  // @route    GET api/profile/github/:username
  // @desc     Get user repos from Github
  // @access   Public
  router.get('/github/:username', (req, res) => {
    try {
      const options = {
        uri: `https://api.github.com/users/${
          req.params.username
        }/repos?per_page=5&sort=created:asc&client_id=${config.get(
          'githubClientId'
        )}&client_secret=${config.get('githubSecret')}`,
        method: 'GET',
        headers: { 'user-agent': 'node.js' }
      };
  
      request(options, (error, response, body) => {
        if (error) console.error(error);
  
        if (response.statusCode !== 200) {
          return res.status(404).json({ msg: 'No Github profile found' });
        }
  
        res.json(JSON.parse(body));
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;