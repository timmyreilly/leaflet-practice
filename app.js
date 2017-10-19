var express = require('express'); 
var mongoose = require('mongoose'); 
var bodyParser = require('body-parser'); 
var logger = require('./logger');
var path = require("path");

require("dotenv").config();

var app = express(); 

app.use(logger);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/" + "index.html");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("App is running on " + process.env.PORT)
});