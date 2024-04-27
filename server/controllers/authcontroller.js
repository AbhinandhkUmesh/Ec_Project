const passport = require('passport')
const express = require('express')
const router = express.Router()
const usermodel = require('../models/usermodel')

require('../../auth')

router.get('/google',
passport.authenticate('google', { scope: ['email','profile'] }));


router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async function(req, res) {
    const user = req.user
   
    const userData = {
        Username: user.displayName,
        email: user.emails && user.emails.length > 0 ? user.emails[0].value : 'No Email',
        image: user.photos && user.photos.length > 0 ? user.photos[0].value : 'No Image'
      }
      console.log("//////////////////",user)
      const userEmail = await usermodel.findOne({email:userData.email})
      console.log("//////////=======",userEmail);
      try {
        if(userEmail){
            req.session.isUser = true
            req.session.email = userEmail.email
            res.redirect('/home');
        }else{
            const createdUser = await usermodel.create(userData);
            req.session.isUser = true
            console.log(createdUser);
            res.redirect('/home');
        }

        
      } catch (error) {
        console.error(error);
        res.render('error'); // Render an error page if there's an error

      }
  });





module.exports = router

