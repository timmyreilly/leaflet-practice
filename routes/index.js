const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const userRoutes = require("./user")
module.exports = function(app, passport){
// API Routes
app.use("/api", apiRoutes);
// User Routes
app.use("/user", userRoutes);

//Main page -- can only be accessed if logged in
	app.get("/profile", isLoggedIn, function(req, res){
		res.sendFile(path.join(__dirname, "../public/map.html"))
	})

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


}


