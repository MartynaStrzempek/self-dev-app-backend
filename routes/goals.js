var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    models.Goal.findAll()
    .then((users) => res.status(200).send(users))
    .catch((error) => res.status(400).send(error));
});

router.get('/:goalId', function (req, res) {
    models.Goal
        .findById(req.params.goalId)
        .then((goal) => res.status(200).send(goal))
        .catch((error) => res.status(400).send(error));
});

router.post('/create', function(req, res) {
    models.Goal
        .create({
            goalName: req.body.goalName,
            subgoalName: req.body.subgoalName
        })
        .then((user) => res.status(200).send(user))
        .catch((error) => res.status(400).send(error));
});

router.delete('/:goalId', function (req, res) {
    models.Goal
        .findById(req.params.goalId)
        .then(goal => {
            if (!goal) {
                return res.status(400).send({
                    message: 'Goal Not Found',
                });
            }
            return goal
                .destroy()
                .then(() => res.status(204).send())
                .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
});

router.put('/:goalId', function (req, res) {
    models.Goal
        .findById(req.params.goalId)
        .then(goal => {
            if (!goal) {
                return res.status(404).send({
                    message: 'Goal Not Found',
                });
            }
            return goal
                .update({
                    goalName: req.body.goalName || goal.goalName,
                    subgoalName: req.body.subgoalName || goal.subgoalName
                })
                .then((goal) => res.status(200).send(goal))
                .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
});

module.exports = router;
