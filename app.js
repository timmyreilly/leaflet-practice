var express = require('express'); 
var mongoose = require('mongoose'); 
var bodyParser = require('body-parser'); 
var logger = require('./logger');
var path = require("path");
var routes = require('./routes');
var session = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');

require("dotenv").config();
require('./config/passport')(passport);
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useMongoClient:true, promiseLibrary: global.Promise }); 

var app = express(); 


app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

routes(app, passport);





app.listen(process.env.PORT || 3000, function(){
    console.log("App is running on " + process.env.PORT)
});