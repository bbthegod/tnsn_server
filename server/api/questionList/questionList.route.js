// eslint-disable-next-line new-cap
const router = require('../../../node_modules/express').Router();
const validate = require('express-validation');
const questionListCtrl = require('./questionList.controller');
const questionListValidation = require('./questionList.validation');
const { isAuthenticated } = require('../../middleware/authentication');

router
  .route('/')
  .get(isAuthenticated(['admin', 'judge', 'receptionist']), questionListCtrl.list)
  .post(isAuthenticated(['admin']), validate(questionListValidation.create), questionListCtrl.create);

router
  .route('/:questionListId')
  .get(isAuthenticated(['admin', 'judge', 'receptionist']), questionListCtrl.get)
  .put(isAuthenticated(['admin']), validate(questionListValidation.update), questionListCtrl.update)
  .delete(isAuthenticated(['admin']), questionListCtrl.remove);
router.param('questionListId', questionListCtrl.load);

module.exports = router;
