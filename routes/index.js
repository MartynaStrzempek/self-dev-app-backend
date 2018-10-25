var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    models.Result.find({
        include: [ models.Goal ]
    })
        .then((users) => res.status(200).send(users))
        .catch((error) => res.status(400).send(error));
});



module.exports = router;
