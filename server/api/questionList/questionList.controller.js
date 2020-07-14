/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const QuestionList = require('./questionList.model');
const Question = require('../question/question.model');
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');

/**
 * Load questionList and append to req
 */
async function load(req, res, next, id) {
  // eslint-disable-next-line no-param-reassign
  req.questionList = await QuestionList.get(id);
  if (!req.questionList) {
    next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  }
  next();
}
/**
 * list questionList
 */
async function list(req, res, next) {
  try {
    const { limit = 500, skip = 0, sort, filter } = req.query;
    const questionLists = await QuestionList.list({ limit, skip, sort, filter });
    res.json(questionLists);
  } catch (e) {
    next(e);
  }
}
/**
 * create questionList
 */
// eslint-disable-next-line consistent-return
async function create(req, res, next) {
  try {
    // eslint-disable-next-line max-len
    const { name, questions, usingQuestion, isRandom } = req.body;
    try {
      let questionsArray = [];
      for (let i = 0; i < questions.length; i++) {
        let question = await Question.findById(questions[i]);
        questionsArray.push({
          questionId: question._id,
          point: question.score,
        });
      }
      let questionList = new QuestionList({
        name: name,
        usingQuestion: usingQuestion,
        questions: questionsArray,
        isRandom: isRandom,
      });
      return questionList
        .save()
        .then((savedquestionList) => {
          if (savedquestionList) res.json(savedquestionList);
          else res.transforemer.errorBadRequest('Thêm mới danh sách câu hỏi thất bại.');
        })
        .catch((e) => {
          next(e);
        });
    } catch (err) {
      next(err);
    }
  } catch (e) {
    next(e);
  }
}
/**
 * update questionList
 */
// eslint-disable-next-line consistent-return
async function update(req, res, next) {
  try {
    // eslint-disable-next-line max-len
    const { name, questions, usingQuestion, isRandom } = req.body;
    try {
      let questionsArray = [];
      for (let i = 0; i < questions.length; i++) {
        let question = await Question.findById(questions[i]);
        questionsArray.push({
          questionId: question._id,
          point: question.score,
        });
      }
      const questionList = req.questionList;
      questionList.name = name;
      questionList.usingQuestion = usingQuestion;
      questionList.questions = questionsArray;
      questionList.isRandom = isRandom;
      return questionList
        .save()
        .then((savedquestionList) => {
          if (savedquestionList) res.json(savedquestionList);
          else res.transforemer.errorBadRequest('Thêm mới danh sách câu hỏi thất bại.');
        })
        .catch((e) => {
          next(e);
        });
    } catch (err) {
      next(err);
    }
  } catch (e) {
    next(e);
  }
}

/**
 * Delete costEstimate.
 * @returns questionList
 */
function remove(req, res, next) {
  const questionList = req.questionList;
  questionList
    .remove()
    .then((result) => {
      res.json({
        success: true,
        data: result,
      });
    })
    .catch((e) => next(e));
}
function get(req, res) {
  res.json(req.questionList);
}

module.exports = {
  list,
  load,
  create,
  update,
  remove,
  get,
};
