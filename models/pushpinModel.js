const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pushpinModel = new Schema({
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
