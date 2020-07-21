/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const Play = require('./play.model');
const User = require('../user/user.model');
const QuesController = require('../question/question.controller');
const ProController = require('../problem/problem.controller');

/**
 * Trả về câu hỏi và gắn vào request
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function load(req, res, next, id) {
  req.question = await Play.get(id);
  if (!req.question) {
    next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  }
  next();
}

/**
 * Trả về danh sách câu hỏi
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function list(req, res, next) {
  try {
    const { limit = 500, skip = 0, sort, filter } = req.query;
    const questions = await Play.list({ limit, skip, sort, filter });
    res.json(questions);
  } catch (e) {
    next(e);
  }
}

function interview(req, res) {
  console.log(req.params);
  // const play =  Play.find({studentId:req.params.studentId});
}

function GetPlay(req, res) {
  let body = req.body;
  if (body) {
    User.findOne({ studentId: body.studentId })
      .then((user) => {
        if (user && user.role == 'user') {
          Play.findOne({ userID: user._id })
            .populate('history.questions.questionId', 'options content')
            .populate('history.problems.problemId')
            .then(async (resultplay) => {
              if (resultplay) {
                res.json({
                  code: 2,
                  status: '401',
                  mesange: 'Tiếp tục',
                  data: resultplay,
                });
              } else {
                let play = new Play({
                  userID: user._id,
                  history: {
                    questions: await QuesController.GetRandomQuestion(),
                    problems: await ProController.GetRandomProblem(),
                  },
                });
                play
                  .save()
                  .then(async (result) => {
                    let playadd = await Play.findById(result._id)
                      .populate('history.questions.questionId', 'options content')
                      .populate('history.problems.problemId');
                    user.playId = result._id;
                    await user.save();
                    res.json({
                      code: 1,
                      status: '200',
                      mesange: 'Bắt đầu thành công',
                      data: playadd,
                    });
                  })
                  .catch((err) => {
                    res.json({
                      code: 2,
                      status: '401',
                      mesange: 'Bắt đầu thất bại',
                    });
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              res.json({
                code: 2,
                status: '401',
                mesange: 'Bắt đầu thất bại',
              });
            });
        } else {
          res.json({
            code: 2,
            status: '401',
            mesange: 'Không tìm thấy sinh viên ',
          });
        }
      })
      .catch((err) => {
        res.json({
          code: 2,
          status: '401',
          mesange: 'Không tìm thấy sinh viên ',
        });
      });
  }
}

module.exports = {
  GetPlay,
  list,
  interview,
};
