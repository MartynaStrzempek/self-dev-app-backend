const User = require('../models').User;
const Goal = require('../models').Goal;
const jwt = require('jsonwebtoken');

module.exports = {
  create(req, res) {
    return User
      .create({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
      })
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return User
      .findAll({
        include: [ Goal ]
      })
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },
  listTarget(req, res) {
    return User
      .findById(req.params.userId)
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error))
  },
  login(req, res) {
    return User
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
  }
};