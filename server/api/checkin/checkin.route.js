// eslint-disable-next-line new-cap
const router = require('../../../node_modules/express').Router();
const validate = require('express-validation');
const checkinCtrl = require('./checkin.controller');
const checkinValidation = require('./checkin.validation');
const { isAuthenticated } = require('../../middleware/authentication');

router
  .route('/')
  .get(isAuthenticated(['admin', 'judge', 'receptionist']), checkinCtrl.list)
  .post(isAuthenticated(['admin', 'receptionist']), validate(checkinValidation.create), checkinCtrl.create);

router
  .route('/:checkinId')
  .get(isAuthenticated(['admin', 'judge', 'receptionist']), checkinCtrl.get)
  .put(isAuthenticated(['admin', 'receptionist']), validate(checkinValidation.update), checkinCtrl.update)
  .delete(isAuthenticated(['admin', 'receptionist']), checkinCtrl.remove);
router.param('checkinId', checkinCtrl.load);

module.exports = router;
