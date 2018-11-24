const models = require('../models');
const express = require('express');
const router = express.Router();
const usersController = require('../controllers').users;
const goalsController = require('../controllers').goals;
const statusesController = require('../controllers').statuses;
const resultsController = require('../controllers').results;
const prisesController = require('../controllers').prises;

router.post('/statuses', statusesController.create);
router.get('/statuses', statusesController.list);

router.post('/users', usersController.create);
router.get('/users', usersController.list);
router.get('/users/:userId', usersController.listTarget);
router.post('/login', usersController.login);

router.post('/users/:userId/goals', verifyToken, goalsController.create);
router.put('/users/:userId/goals/:goalId', verifyToken, goalsController.update);
router.get('/users/:userId/goals', verifyToken, goalsController.list);
router.delete('/goals/:goalId', verifyToken, goalsController.destroy);

router.post('/users/:userId/goals/:goalId/results', verifyToken, resultsController.create);
router.put('/results/:resultId', verifyToken, resultsController.update);

router.get('/goals/:goalId/prises', verifyToken, prisesController.list);
router.get('/prises/:priseId', verifyToken, prisesController.listTarget);

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = router;
