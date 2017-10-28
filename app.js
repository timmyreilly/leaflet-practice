var express = require('express'); 
var mongoose = require('mongoose'); 
var bodyParser = require('body-parser'); 
var logger = require('./logger');
var path = require("path");

require("dotenv").config();

mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useMongoClient:true, promiseLibrary: global.Promise }); 

var app = express(); 


app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));  
app.use(express.static(path.join(__dirname, "public")));

var routes = require('./routes');


app.use(routes); 




app.listen(process.env.PORT || 3000, function(){
    console.log("App is running on " + process.env.PORT)
});