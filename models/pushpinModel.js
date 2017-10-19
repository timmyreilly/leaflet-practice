var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pushpinModel = new Schema({
    loc: {
        bounds: [{
            type: Number
        }],
        x: { type: String },
        y: { type: String }
    },
    metadata: {
        asset: { type: String },
        author: { type: String },
        description: { type: String },
        title: { type: String }
    }
});

module.exports = mongoose.model('Pushpin', pushpinModel);
