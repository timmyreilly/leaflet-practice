const User = require("../../models/User.js")
const router = require("express").Router();

//User Routes
//Test usser route
router.post('/newuser', function(req, res){
	let newUser = new User
	newUser.name = req.body.name;
	newUser.password = newUser.generateHash(req.body.password)
	newUser.save()
	console.log(req.body)
});

 module.exports = router
