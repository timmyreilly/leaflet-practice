const router = require("express").Router();
const Pushpin = require("../../models/pushpinModel.js")
const User = require("../../models/User.js")

//User Routes
//Test usser route
router.post('/user/newuser', function(req, res){
	let newUser = new User(req.body)
	newUser.save()
	console.log(req.body)
});
//Pushpin Routes
router.route('/pushpins')
    .post(function (req, res) {
        var pushpin = new Pushpin(req.body);
        console.log(req.body); 
        pushpin.save();
        res.status(201).send(pushpin);
    })
    .get(function (req, res) {
        console.log(Pushpin)
        var query = {};
        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        Pushpin.find(query, function (err, pushpins) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(pushpins);
            }
        })
    });

    //Route for adding a new pushpin to DB
    router.post("/pushpins/newpushpin", function (req, res){
        var pushpin = {
            loc: {
                x: req.body.loc.x,
                y: req.body.loc.y
            },
            metadata: {
                asset: req.body.metadata.asset,
                author: req.body.metadata.author,
                description: req.body.metadata.description,
                title: req.body.metadata.title
            }
        }
        var newPushpin = new Pushpin(pushpin)
        newPushpin.save(function(error, result){
            if(error) console.log (error);
            return res.json(result);
        })
    })

    //Route for deleting pushpin from DB
    router.put("/pushpins/:id/delete", function (req, res){
        Pushpin.findByIdAndRemove(req.params.id, (err, pushpin) => {  
            let response = {
                message: "Pushpin successfully deleted",
                id: req.params.id
            };
        res.status(200).send(response);
        });
    });

        router.use('/pushpins/:pushpinId', function (req, res, next) {
            Pushpin.findById(req.params.pushpinId, function (err, pushpin) {
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

        router.route('/pushpins/:pushpinId')
        .get(function (req, res) {
            res.json(req.pushpin);
        })
        .put(function (req, res) {
            console.log(req)
            req.pushpin.title = req.body.title;
            req.pushpin.lat = req.body.lat;
            req.pushpin.lon = req.body.lon;
            req.pushpin.description = req.body.description;
            req.pushpin.author = req.body.author;
            req.pushpin.asset = req.body.asset;
            req.pushpin.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.pushpin);
                }
            });
        })
        .patch(function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            for (var p in req.body) {
                req.pushpin[p] = req.body[p];
            }

            req.pushpin.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.pushpin);
                }
            });
        })
        .delete(function (req, res) {
            req.pushpin.remove(function (err) {
                if (err) {
                    res.statucCode(500).send(err);
                } else {
                    res.status(204).send("removed");
                }
            });

        });



 module.exports = router