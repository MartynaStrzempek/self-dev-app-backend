const Goal = require('../models').Goal;
const Prise = require('../models').Prise;
const User = require('../models').User;
const Result = require('../models').Result;
const jwt = require('jsonwebtoken');

module.exports = {
  create(req, res) {
    jwt.verify(req.token, 'secretKey', function (err) {
      if (err) {
        res.sendStatus(403);
      } else {
        return Prise
          .create({
            description: req.body.description,
            score: req.body.score
          })
          .then(prise => {
            return User
              .findById(req.params.userId)
              .then(user => {
                return Goal
                  .create({
                    goalName: req.body.goalName,
                    subgoalName: req.body.subgoalName,
                    PriseId: prise.dataValues.id,
                    UserId: user.dataValues.id
                  })
                  .then(goal => res.status(200).send(goal))
                  .catch(error => res.status(400).send(error));
              })
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
      }
    });
  },
  list(req, res) {
    jwt.verify(req.token, 'secretKey', function (err) {
      if (err) {
        res.sendStatus(403);
      } else {
        return Goal
          .findAll({
            where: {
              UserId: req.params.userId
            },
            include: [ Result ]
          })
          .then(goals => res.status(200).send(goals))
          .catch(error => console.log(error));
      }
    });
  },
  listTarget(req, res) {

  },
  update(req, res) {
    jwt.verify(req.token, 'secretKey', function (err) {
      if (err) {
        res.sendStatus(403);
      } else {
        return Prise
          .findById(req.body.priseId)
          .then(prise => {
            return prise
              .update({
                description: req.body.description,
                score: req.body.score
              })
          })
          .then(() => {
            return User
              .findById(req.params.userId)
              .then(user => {
                return Goal
                  .findById(req.params.goalId)
                  .then(goal => {
                    return goal
                      .update({
                        goalName: req.body.goalName,
                        subgoalName: req.body.subgoalName,
                      })
                  })
                  .then(goal => res.status(200).send(goal))
                  .catch(error => res.status(400).send(error));
              })
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
      }
    });
  },
  destroy(req, res) {
    jwt.verify(req.token, 'secretKey', function (err) {
      if (err) {
        res.sendStatus(403);
      } else {
        return Goal
          .findById(req.params.goalId)
          .then(goal => {
            return goal
              .destroy()
              .then(() => res.status(200).send())
              .catch(error => res.status(400).send(error))
          })
          .catch(error => res.status(400).send(error))
      }
    });
  }
};
