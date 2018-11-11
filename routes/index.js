var models = require('../models');
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/status', function (req, res) {
   models.Status
       .create({
            name: req.body.name
       })
       .then(status => res.status(200).send(status))
       .catch((error) => res.status(400).send(error));
});

router.get('/statuses', function (req, res) {
    models.Status
        .findAll()
        .then(statuses => res.status(200).send(statuses))
        .catch((error) => res.status(400).send(error));
});

router.post('/user', function (req, res) {
    models.User
        .create({
            login: req.body.login,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => res.status(200).send(user))
        .catch((error) => res.status(400).send(error));
});

router.get('/users', function (req, res) {
    models.User
        .findAll({
            include: [ models.Goal ]
        })
        .then(users => res.status(200).send(users))
        .catch((error) => res.status(400).send(error));
});

router.post('/login', function (req, res) {
   models.User
       .find({
           where: {
               login: req.body.login
           }
       })
       .then(user => {
           if (user) {
               if (user.password === req.body.password) {
                   jwt.sign({ user }, 'secretKey', function (err, token) {
                       res.json({
                           token: token,
                           userId: user.id
                       });
                   })
               } else {
                   res.status(400).json({ error: "Password does not match to login" })
               }
           } else {
               res.status(400).json({ error: "There is no user with login like this" });
           }
       })
       .catch(error => res.status(400).send(error))
});

router.get('/users/:userId', function (req, res) {
    models.User
        .findById(req.params.userId)
        .then(user => res.status(200).send(user))
        .catch(error => res.status(400).send(error))
});

router.post('/user/:userId/goal', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretKey', function (err) {
       if (err) {
           res.sendStatus(403);
       } else {
           models.Prise
               .create({
                   description: req.body.description,
                   score: req.body.score
               })
               .then(prise => {
                   models.User
                       .findById(req.params.userId)
                       .then(user => {
                           models.Goal
                               .create({
                                   goalName: req.body.goalName,
                                   subgoalName: req.body.subgoalName,
                                   PriseId: prise.dataValues.id,
                                   UserId: user.dataValues.id
                               })
                               .then(goal => res.status(200).send(goal))
                               .catch((error) => res.status(400).send(error));
                           // return res.status(200).send(user);
                       })
                       .catch((error) => res.status(400).send(error));
               })
               .catch((error) => res.status(400).send(error));
       }
    });
});

router.put('/user/:userId/goal/:goalId', function (req, res) {
    models.Prise
        .findById(req.body.priseId)
        .then(prise => {
            prise
                .update({
                    description: req.body.description,
                    score: req.body.score
                })
        })
        .then(() => {
            models.User
                .findById(req.params.userId)
                .then(user => {
                    models.Goal
                        .findById(req.params.goalId)
                        .then(goal => {
                            goal
                                .update({
                                    goalName: req.body.goalName,
                                    subgoalName: req.body.subgoalName,
                                })
                        })
                        .then(goal => res.status(200).send(goal))
                        .catch((error) => res.status(400).send(error));
                })
                .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
});


// router.get('/user/:userId/goals', function (req, res) {
//     models.User
//         .findById(req.params.userId, {
//             include: [ models.Goal ]
//         })
//         .then(user => {
//             console.log(user)
//             return res.status(200).send(user.dataValues.Goals)
//         })
//         .catch((error) => res.status(400).send(error));
// });

router.post('/user/:userId/goal/:goalId/result', function (req, res) {
    models.User
        .findById(req.params.userId, {
            include: [ models.Goal ]
        })
        .then(user => {
            const goal = user.dataValues.Goals.filter(goal => goal.dataValues.id == req.params.goalId);
            const date = new Date();
            models.Status
                .findAll({
                    where: {
                        name: req.body.status
                    }
                })
                .then(status => {
                    models.Result
                        .create({
                            date: req.body.date,
                            note: req.body.note,
                            GoalId: goal[0].dataValues.id,
                            StatusId: status[0].dataValues.id
                        })
                        .then(result => res.status(200).send(result))
                        .catch(error => console.log(error))
                })
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
});

router.put('/result/:resultId', function (req, res) {
    let statusId;
    models.Status
        .find({
            where: {
                name: req.body.status
            }
        })
        .then(status => statusId = status.dataValues.id)
        .catch(error => res.send(error));

    models.Result
        .findById(req.params.resultId)
        .then(result => {
            result
                .update({
                    StatusId: statusId ? statusId : req.body.statusId,
                    note: req.body.note,
                })
                .then((res) => {
                    console.log("result---------------", result)
                    res.status(200).send(res)
                })
                .catch(err => res.send(err));
        })
        .catch((error) => console.log(error));
});

router.get('/user/:userId/goals', function (req, res) {
    models.Goal
        .findAll({
           where: {
               UserId: req.params.userId
           },
           include: [ models.Result ]
        })
        .then(goals => {
            return res.send(goals)
        })
        .catch((error) => console.log(error));
});

router.get('/goal/:goalId/prise', function (req, res) {
    models.Goal
        .findById(req.params.goalId)
        .then(goal => {
            const priseId = goal.dataValues.PriseId;
            models.Prise
                .findById(priseId)
                .then(prise => res.status(200).send(prise))
                .catch(err => res.status(400).send(err));
        })
        .catch((error) => console.log(error));
});

router.get('/prises/:priseId', function (req, res) {
    models.Prise
        .findById(req.params.priseId)
        .then(prise => res.status(200).send(prise))
        .catch((error) => console.log(error));
});

router.delete('/goals/:goalId', function (req, res) {
    models.Goal
        .findById(req.params.goalId)
        .then(goal => {
            return goal
                .destroy()
                .then(() => res.status(200).send())
                .catch(error => res.status(400).send(error))
        })
        .catch(error => res.status(400).send(error))
});

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
