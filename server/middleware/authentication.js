/* eslint-disable no-undef */
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const User = require('../api/user/user.model');

function isAuthenticated(array) {
  return (req, res, next) => {
    jwt.verify(req.token, config.jwtSecret, (err, data) => {
      if (err) {
        return next(err);
      }
      User.findOne({ studentId: data.studentId }, { password: 0, createdAt: 0, updatedAt: 0, playId: 0 })
        .then((user) => {
          if (user) {
            for (item of array) {
              if (item == user.role) {
                req.auth = user;
                return next();
              }
            }
          }
          next(new Error('Authentication failed'));
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    });
  };
}

module.exports = { isAuthenticated };
