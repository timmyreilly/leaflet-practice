var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pushpinModel = new Schema({
    //coordinates should be in [longitude, latitude]
    geo: {
      type: {type: String},
      coordinates: { type: [Number] }
   }, 
    
    asset: { type: String },
    author: { type: String },
    description: { type: String },
    title: { type: String }

});

module.exports = mongoose.model('Pushpin', pushpinModel);
