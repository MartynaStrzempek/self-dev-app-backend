var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    models.Note.findAll()
        .then((users) => res.status(200).send(users))
        .catch((error) => res.status(400).send(error));;
});

router.post('/create', function(req, res) {
    models.Note.create({
        content: req.body.content
    })
        .then((user) => res.status(200).send(user))
        .catch((error) => res.status(400).send(error));
});

module.exports = router;
