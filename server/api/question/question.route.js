// eslint-disable-next-line new-cap
const router = require('../../../node_modules/express').Router();
const validate = require('express-validation');
const questionCtrl = require('./question.controller');
const questionValidation = require('./question.validation');
const { isAuthenticated } = require('../../middleware/authentication');

router
  .route('/')
  .get(isAuthenticated(['admin', 'judge', 'receptionist']), questionCtrl.list)
  .post(isAuthenticated(['admin']), validate(questionValidation.create), questionCtrl.create);

router
  .route('/:questionId')
  .get(isAuthenticated(['admin', 'judge', 'receptionist']), questionCtrl.get)
  .put(isAuthenticated(['admin']), validate(questionValidation.update), questionCtrl.update)
  .delete(isAuthenticated(['admin']), questionCtrl.remove);
router.param('questionId', questionCtrl.load);

module.exports = router;
