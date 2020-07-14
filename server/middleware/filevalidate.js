const APIError = require('../helpers/APIError');
const err = new APIError('File is required');
function filevalidate(req, res, next) {
  if (!req.file) return next(err);
  return next();
}

module.exports = { filevalidate };
