// eslint-disable-next-line new-cap
const router = require('../../../node_modules/express').Router();
const playCtrl = require('./play.controller');
const { isAuthenticated } = require('../../middleware/authentication');
router
  .route('/')
  .post(isAuthenticated(['admin', 'user']), playCtrl.GetPlay)
  .get(isAuthenticated(['admin', 'judge', 'receptionist']), playCtrl.list);
router.post('/interview/:id', isAuthenticated(['admin', 'judge']), playCtrl.interview);

module.exports = router;
