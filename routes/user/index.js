var path = require("path");
var passport = require("passport")
var router = require("express").Router();



	router.post('/newuser', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
      }));

	router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
      }));

	router.get("/logout", function(req, res){
		req.logout();
		res.redirect('/');
	})

module.exports = router