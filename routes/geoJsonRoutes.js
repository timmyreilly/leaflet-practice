var express = require('express');
var GeoJSON = require('geojson'); 

var routes = function (Pushpin){
    var geoJsonRouter = express.Router(); 

    geoJsonRouter.route('/')
    .get(function (req, res) {
        var query = {};
        if (req.query.asset) {
            query.asset = req.query.asset;
        }
        Pushpin.find(query).select('-__v').lean().exec(function (err, pushpins) {
            if (err) {
                res.status(500).send(err);
            } else {

              // console.log(pushpins);
              //res.json(GeoJSON.parse(pushpins, {Point: 'coordinates'}));
             res.json(GeoJSON.parse(pushpins, {GeoJSON: 'geo'})); 
            }
        })
    });
    return geoJsonRouter 
};

module.exports = routes;