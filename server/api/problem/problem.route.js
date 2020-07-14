// eslint-disable-next-line new-cap
const router = require('../../../node_modules/express').Router();
const validate = require('express-validation');
const problemCtrl = require('./problem.controller');
const problemValidation = require('./problem.validation');
const { isAuthenticated } = require('../../middleware/authentication');

router
  .route('/')
  .get(isAuthenticated(['admin', 'judge', 'receptionist']), problemCtrl.list)
  .post(isAuthenticated(['admin']), validate(problemValidation.create), problemCtrl.create);

router
  .route('/:problemId')
  .get(isAuthenticated(['admin', 'judge', 'receptionist']), problemCtrl.get)
  .put(isAuthenticated(['admin']), validate(problemValidation.update), problemCtrl.update)
  .delete(isAuthenticated(['admin']), problemCtrl.remove);

router.param('problemId', problemCtrl.load);
module.exports = router;
