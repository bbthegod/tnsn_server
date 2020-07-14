const config = require('../../config/config');
const APIError = require('../helpers/APIError');
function master(req, res, next) {
  try {
    if (req.token) {
      if (req.token !== config.masterSecret) return next(new APIError('Master key is not correct'));
      return next();
    } else {
      return next(new APIError('Master key is required'));
    }
  } catch (e) {
    return next(e);
  }
}

module.exports = { master };
