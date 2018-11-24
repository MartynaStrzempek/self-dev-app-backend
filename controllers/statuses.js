const Status = require('../models').Status;

module.exports = {
  create(req, res) {
    return Status
      .create({
        name: req.body.name
      })
      .then(status => res.status(200).send(status))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return Status
      .findAll()
      .then(statuses => res.status(200).send(statuses))
      .catch(error => res.status(400).send(error));
  }
};