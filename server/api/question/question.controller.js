/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const Question = require('./question.model');
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');
const QuestionList = require('../questionList/questionList.model');
/**
 * Trả về câu hỏi và gắn vào request
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function load(req, res, next, id) {
  req.question = await Question.get(id);
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
    const questions = await Question.list({ limit, skip, sort, filter });
    res.json(questions);
  } catch (e) {
    next(e);
  }
}

/**
 * Tạo 1 câu hỏi
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function create(req, res, next) {
  try {
    const { content, answer1, answer2, answer3, answer4, correctAnswer, score } = req.body;
    const question = new Question({
      content,
      options: [
        {
          numbering: 'a',
          answer: answer1,
        },
        {
          numbering: 'b',
          answer: answer2,
        },
        {
          numbering: 'c',
          answer: answer3,
        },
        {
          numbering: 'd',
          answer: answer4,
        },
      ],
      correctAnswer,
      score,
    });

    return question
      .save()
      .then((savedQuestion) => {
        if (savedQuestion) {
          res.status(200).json({
            code: 1,
            data: savedQuestion,
          });
        } else {
          res.status(400).json({
            code: 2,
            message: 'Thêm mới câu hỏi thất bại.',
          });
        }
      })
      .catch((e) => {
        next(e);
      });
  } catch (e) {
    next(e);
  }
}

/**
 * Cập nhật 1 câu hỏi
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function update(req, res, next) {
  try {
    const { content, answer1, answer2, answer3, answer4, correctAnswer, score } = req.body;
    const question = req.question;
    question.content = content;
    question.options[0].answer = answer1;
    question.options[1].answer = answer2;
    question.options[2].answer = answer3;
    question.options[3].answer = answer4;
    question.correctAnswer = correctAnswer;
    question.score = score;
    question
      .save()
      .then((result) => {
        if (result) {
          res.status(200).json({
            code: 1,
            data: result,
            message: 'Sửa mới câu hỏi thành công.',
          });
        } else {
          res.status(400).json({
            code: 2,
            message: 'Sửa mới câu hỏi thất bại.',
          });
        }
      })
      .catch((e) => next(e));
  } catch (e) {
    next(e);
  }
}

/**
 * Xoá 1 câu hỏi
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function remove(req, res, next) {
  req.question
    .remove()
    .then((result) => {
      res.status(200).json({
        code: 1,
        data: result,
        message: 'Xóa câu hỏi thành công',
      });
    })
    .catch((e) => next(e));
}

function get(req, res) {
  res.json(req.question);
}

/**
 * Trả về một mảng câu hỏi ngẫu nhiên
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function GetRandomQuestion() {
  try {
    let listQ = await QuestionList.find();
    let listP = [];
    let dem = 0;
    if (listQ != null) {
      await listQ.forEach((list) => {
        let arr = GetArrRandom(list.usingQuestion, list.questions.length);
        for (let i = 0; i < list.usingQuestion; i++) {
          listP.push({
            questionId: list.questions[arr[i]].questionId,
            answer: false,
          });
        }
      });
    }
    return listP;
  } catch (err) {
    return null;
  }
}

let GetArrRandom = (useQues, count) => {
  try {
    let arr = [];
    while (arr.length < useQues) {
      let length = arr.length;
      let number = Math.floor(Math.random() * count + 1);
      if (length == 0) {
        arr.push(number - 1);
      } else {
        let dem = 0;
        for (let i = 0; i < length; i++) {
          if (number - 1 != arr[i]) {
            dem++;
          }
        }
        if (dem == length) {
          arr.push(number - 1);
        }
      }
    }
    return arr;
  } catch (err) {
    return null;
  }
};
module.exports = {
  list,
  load,
  create,
  update,
  remove,
  get,
  GetRandomQuestion,
};
