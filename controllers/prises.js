const Prise = require('../models').Prise;
const Goal = require('../models').Goal;
const jwt = require('jsonwebtoken');

module.exports = {
  list(req, res) {
    jwt.verify(req.token, 'secretKey', function (err) {
      if (err) {
        res.sendStatus(403);
      } else {
        return Goal
          .findById(req.params.goalId)
          .then(goal => {
            const priseId = goal.dataValues.PriseId;
            return Prise
              .findById(priseId)
              .then(prise => res.status(200).send(prise))
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
      }
    });
  },
  listTarget(req, res) {
    jwt.verify(req.token, 'secretKey', function (err) {
      if (err) {
        res.sendStatus(403);
      } else {
        return Prise
          .findById(req.params.priseId)
          .then(prise => res.status(200).send(prise))
          .catch(error => res.status(400).send(error));
      }
    });
  }
};