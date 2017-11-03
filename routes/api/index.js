var router = require("express").Router();
var Pushpin = require("../../models/pushpinModel.js")
var GeoJSON = require('geojson');

router.route('/geojson').get((req, res) => {
  var query = {};
  if (req.query.asset) {
    query.asset = req.query.asset;
  }
  Pushpin.find(query).select('-__v').lean().exec((err, pushpins) => {
    if (err) {
      res.status(500).send(err);
    } else {

      // console.log(pushpins);
      //res.json(GeoJSON.parse(pushpins, {Point: 'coordinates'}));
      res.json(GeoJSON.parse(pushpins, {GeoJSON: 'geo'}));
    }
  })
});
router.route('/').post((req, res) => {
  var pushpin = new Pushpin(req.body);
  console.log(req.body);
  pushpin.save();
  res.status(201).send(pushpin);
}).get((req, res) => {
  var query = {};
  if (req.query.genre) {
    query.genre = req.query.genre;
  }
  Pushpin.find(query, (err, pushpins) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(pushpins);
    }
  })
});

//Route for adding a new pushpin to DB
router.post("/pushpins/newpushpin", (req, res) => {
  var pushpin = {
    geo: {
      type: "Point",
      coordinates: [req.body.loc.x, req.body.loc.y]
    },
    asset: req.body.properties.asset,
    author: req.body.properties.author,
    description: req.body.properties.description,
    title: req.body.properties.title
  }
  var newPushpin = new Pushpin(pushpin)
  newPushpin.save((error, result) => {
    if (error)
      console.log(error);
    return res.json(result);
  })
})

//Route for deleting pushpin from DB
router.put("/pushpins/:id/delete", (req, res) => {
  Pushpin.findByIdAndRemove(req.params.id, (err, pushpin) => {
    let response = {
      message: "Pushpin successfully deleted",
      id: req.params.id
    };
    res.status(200).send(response);
  });
});

//Route for updating a pushpin from DB
router.post("/pushpins/:id/update", (req, res) => {
  var pushpinID = req.params.id;
  console.log(req.body.asset)
  var update = {
    $set: {
      asset: req.body.asset,
      author: req.body.author,
      description: req.body.description,
      title: req.body.title
    }
  };
  Pushpin.findByIdAndUpdate(req.params.id, update, {
    new: true
  }, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    return res.json(result);
  });
});

router.use('/pushpins/:pushpinId', (req, res, next) => {
  Pushpin.findById(req.params.pushpinId, (err, pushpin) => {
    if (err) {
      res.status(500).send(err);
    } else if (pushpin) {
      req.pushpin = pushpin;
      next();
    } else {
      res.statusCode(404).send('no pushpin found');
    }
  });
});

router.route('/pushpins/:pushpinId').get((req, res) => {
  res.json(req.pushpin);
}).put((req, res) => {
  console.log(req)
  req.pushpin.title = req.body.title;
  req.pushpin.lat = req.body.lat;
  req.pushpin.lon = req.body.lon;
  req.pushpin.description = req.body.description;
  req.pushpin.author = req.body.author;
  req.pushpin.asset = req.body.asset;
  req.pushpin.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(req.pushpin);
    }
  });
}).patch((req, res) => {
  if (req.body._id) {
    delete req.body._id;
  }
  for (var p in req.body) {
    req.pushpin[p] = req.body[p];
  }

  req.pushpin.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(req.pushpin);
    }
  });
}).delete((req, res) => {
  req.pushpin.remove((err) => {
    if (err) {
      res.statucCode(500).send(err);
    } else {
      res.status(204).send("removed");
    }
  });

});

module.exports = router
