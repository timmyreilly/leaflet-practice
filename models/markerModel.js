const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const markerModel = new Schema({
//     //coordinates should be in [longitude, latitude]
//     geo: {
//         type: { type: String },
//         coordinates: { type: [Number] }
//     },
//     properties: {
//         asset: { type: String },
//         author: { type: String },
//         description: { type: String },
//         title: { type: String }
//     }

// });

const markerModel = new Schema(
    {
        coordinates: { type: [Number] },
        asset: { type: String },
        author: { type: String },
        description: { type: String },
        title: { type: String }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Marker', markerModel);

/* Sample GeoJSON 
features[
    {
        type: "Feature",
        geometry: {
            type: "point",
            coordinates:[-122, 36]
        }
        properties: {
            id: "123abc",
            PropertyType: "Central Shelter",
            AssetType: "Water",
            Author: "User1",
            Notes: "Where to find water", 
            Address: "Optional Address Info"
        }
    }, 
]


*/