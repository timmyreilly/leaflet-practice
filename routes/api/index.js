const router = require('express').Router();
const GeoJSON = require('geojson');
const Marker = require('../../models/markerModel.js')

router.route('/markers')
  .post((req, res) => {
    const marker = new Marker(req.body);
    console.log(req.body);
    marker.save();
    res.status(201).send(marker);
  })
  .get((req, res) => {
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    Marker.find(query, (err, markers) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(markers);
      }
    })
  });

router.use('/markers/:markerId', (req, res, next) => {
  Marker.findById(req.params.markerId, (err, marker) => {
    if (err) {
      res.status(500).send(err);
    } else if (marker) {
      req.marker = marker;
      next();
    } else {
      res.statusCode(404).send('no marker found');
    }
  });
});

router.route('/markers/:markerId')
  .get((req, res) => {
    res.json(req.marker);
  })
  // .put((req, res) => {
  //   console.log(req)
  //   req.marker.title = req.body.title;
  //   req.marker.lat = req.body.lat;
  //   req.marker.lon = req.body.lon;
  //   req.marker.description = req.body.description;
  //   req.marker.author = req.body.author;
  //   req.marker.asset = req.body.asset;
  //   req.marker.save((err) => {
  //     if (err) {
  //       res.status(500).send(err);
  //     } else {
  //       res.json(req.marker);
  //     }
  //   });
  // })
  // Update Marker 
  .put((req, res) => {
    if (req.body._id) {
      delete req.body._id;
    }
    for (let p in req.body) {
      req.marker[p] = req.body[p];
    }

    req.marker.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(req.marker);
      }
    });
  })
  // This is updating the data by marker id 
  .post((req, res) => {
    if (req.body._id) {
      delete req.body._id;
    }
    for (let p in req.body) {
      req.marker[p] = req.body[p];
    }

    req.marker.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(req.marker);
      }
    });

    
  })
  .delete((req, res) => {
    req.marker.remove((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204).send('removed');
      }
    });
  });


router.route('/geojson').get((req, res) => {
  const query = {};
  if (req.query.asset) {
    query.asset = req.query.asset;
  }
  Marker.find(query).select('-__v').lean().exec((err, markers) => {
    if (err) {
      res.status(500).send(err);
    } else {

      res.json(GeoJSON.parse(markers, {Point: 'coordinates'}));
      // res.json(GeoJSON.parse(markers, { GeoJSON: 'geo' }));
    }
  })
});

//Routes to expose GEOJSON data from SF Gov endpoints
// Privately Owned Public Open Spaces (POPOS)
router.get('/popos', (req, res) => {
  request('https://data.sfgov.org/resource/fff3ub7-d4yy.geojson', (error, response, body) => {
    res.send(JSON.parse(body));
  })
})

// Park and Open Space Map
router.get('/parkopenspace', (req, res) => {
  request('https://data.sfgov.org/resource/94uf-amnx.geojson', (error, response, body) => {
    res.send(JSON.parse(body));
  });
});

// San Francisco Seismic Hazard Zones
router.get('/seismiczones', (req, res) => {
  request('https://data.sfgov.org/resource/t2cc-dy6b.geojson', (error, response, body) =>{
    res.send(JSON.parse(body));
  });
});

// Map of Schools
router.get('/schools', (req, res) => {
  request('https://data.sfgov.org/resource/mmsr-vumy.geojson', (error, response, body) => {
    res.send(JSON.parse(body));
  });
});

// Map of Registered Business Locations
router.get('/businesslocs', (req, res) => {
  request('https://data.sfgov.org/resource/vbiu-2p9h.geojson', (error, response, body) => {
    res.send(JSON.parse(body));
  });
});

// Map of City Facilities
router.get('/cityfacilities', (req, res) => {
  request('https://data.sfgov.org/resource/i5wr-crji.geojson', (error, response, body) => {
    res.send(JSON.parse(body));
  });
});

// Health Care Facilities
router.get('/healthcarefacilities', (req, res) => {
  request('https://data.sfgov.org/resource/sci7-7q9i.geojson', (error, response, body) => {
    res.send(JSON.parse(body))
  });
});

// Community Resiliency Indicator System
router.get('/commresindicator', (req, res) => {
  request('https://data.sfgov.org/resource/wsj2-27m9.geojson', (error, response, body) => {
    res.send(JSON.parse(body));
  });
});

// Pit Stop Locations
router.get('/pitstop', (req, res) => {
  request('https://data.sfgov.org/resource/snkr-6jdf.geojson', (error, response, body) => {
    res.send(JSON.parse(body));
  });
});

// SF Find Neighborhoods
router.get('/sffindneighborhoods', (req, res) => {
  request('https://data.sfgov.org/resource/6ia5-2f8k.geojson', (error, response, body) => {
    res.send(JSON.parse(body));
  });
});





// Functionality we might want to use...

// // Route for adding a new marker to DB
// router.post('/markers/newmarker', (req, res) => {
//   const marker = {
//     geo: {
//       type: 'Point',
//       coordinates: [req.body.loc.lng, req.body.loc.lat]
//     },
//     asset: req.body.properties.asset,
//     author: req.body.properties.author,
//     description: req.body.properties.description,
//     title: req.body.properties.title
//   }
//   const newMarker = new Marker(marker)
//   newMarker.save((error, result) => {
//     if (error)
//       console.log(error);
//     return res.json(result);
//   })
// })

// //Route for deleting marker from DB
// router.put('/markers/:id/delete', (req, res) => {
//   Marker.findByIdAndRemove(req.params.id, (err, marker) => {
//     const response = {
//       message: "Marker successfully deleted",
//       id: req.params.id
//     };
//     res.status(200).send(response);
//   });
// });

// //Route for updating a marker from DB
// router.post('/markers/:id/update', (req, res) => {
//   const markerId = req.params.id;
//   console.log(req.body.asset)
//   const update = {
//     $set: {
//       asset: req.body.asset,
//       author: req.body.author,
//       description: req.body.description,
//       title: req.body.title
//     }
//   };
//   Marker.findByIdAndUpdate(req.params.id, update, {
//     new: true
//   }, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
//     return res.json(result);
//   });
// });


module.exports = router
