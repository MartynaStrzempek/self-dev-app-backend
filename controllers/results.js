const Result = require('../models').Result;
const User = require('../models').User;
const Status = require('../models').Status;
const Goal = require('../models').Goal;
const jwt = require('jsonwebtoken');

module.exports = {
  create(req, res) {
    jwt.verify(req.token, 'secretKey', function (err) {
      if (err) {
        res.sendStatus(403);
      } else {
        return User
          .findById(req.params.userId, {
            include: [ Goal ]
          })
          .then(user => {
            const goal = user.dataValues.Goals.filter(goal => goal.dataValues.id == req.params.goalId);
            const date = new Date();
            return Status
              .findAll({
                where: {
                  name: req.body.status
                }
              })
              .then(status => {
                return Result
                  .create({
                    date: req.body.date,
                    note: req.body.note,
                    GoalId: goal[0].dataValues.id,
                    StatusId: status[0].dataValues.id
                  })
                  .then(result => res.status(200).send(result))
                  .catch(error => res.status(400).send(error))
              })
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
      }
    });
  },
  update(req, res) {
    jwt.verify(req.token, 'secretKey', function (err) {
      if (err) {
        res.sendStatus(403);
      } else {
        let statusId;
        Status
          .find({
            where: {
              name: req.body.status
            }
          })
          .then(status => statusId = status.dataValues.id)
          .catch(error => res.send(error));

        return Result
          .findById(req.params.resultId)
          .then(result => {
            result
              .update({
                StatusId: statusId ? statusId : req.body.statusId,
                note: req.body.note,
              })
              .then(result => res.status(200).send(result))
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
      }
    });
  }
};