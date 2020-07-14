const express = require('express');
const userRoutes = require('./server/api/user/user.route');
const authRoutes = require('./server/api/auth/auth.route');
const playRoutes = require('./server/api/play/play.route');
const problemRoutes = require('./server/api/problem/problem.route');
const questionRoutes = require('./server/api/question/question.route');
const questionListRoutes = require('./server/api/questionList/questionList.route');
const checkinRoutes = require('./server/api/checkin/checkin.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/play', playRoutes);
router.use('/problem', problemRoutes);
router.use('/question', questionRoutes);
router.use('/questionlist', questionListRoutes);
router.use('/checkin', checkinRoutes);

module.exports = router;
