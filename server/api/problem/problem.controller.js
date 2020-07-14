/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const Problem = require('./problem.model');

/**
 * Trả về vấn đề và gắn vào request
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function load(req, res, next, id) {
  req.problem = await Problem.findById(id);
  if (!req.problem) {
    next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  }
  next();
}

/**
 * Trả về danh sách vấn đề
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function list(req, res, next) {
  try {
    const { limit = 500, skip = 0, sort, filter } = req.query;
    const problems = await Problem.list({ limit, skip, sort, filter });
    res.json(problems);
  } catch (e) {
    next(e);
  }
}

/**
 * Tạo 1 vấn đề
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function create(req, res, next) {
  try {
    const { title, content, input, output, correctScore, level } = req.body;
    const problem = new Problem({
      title,
      content,
      input,
      output,
      correctScore,
      level,
    });
    return problem
      .save()
      .then((savedproblem) => {
        if (savedproblem) {
          res.status(200).json({
            code: 1,
            data: savedproblem,
          });
        } else {
          res.status(400);
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
 * Cập nhật 1 vấn đề
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function update(req, res, next) {
  try {
    const { title, content, input, output, correctScore, level } = req.body;
    const problem = req.problem;
    problem.title = title;
    problem.content = content;
    problem.input = input;
    problem.output = output;
    problem.correctScore = correctScore;
    problem.level = level;
    problem
      .save()
      .then((result) => {
        if (result) {
          res.status(200).json({
            code: 1,
            data: result,
            message: 'Sửa vấn đề thành công.',
          });
        } else {
          res.status(400);
        }
      })
      .catch((e) => next(e));
  } catch (e) {
    next(e);
  }
}

/**
 * Xoá 1 vấn đề
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function remove(req, res, next) {
  req.problem
    .remove()
    .then((result) => {
      res.status(200).json({
        code: 1,
        data: result,
        message: 'Xóa vấn đề thành công',
      });
    })
    .catch((e) => next(e));
}

function get(req, res) {
  res.json(req.problem);
}

async function GetRandomProblem() {
  let arr = [];
  let proEasy = await Problem.find({
    level: 1,
  });
  let proNomal = await Problem.find({
    level: 2,
  });
  let proHard = await Problem.find({
    level: 3,
  });
  arr.push({
    problemId: proEasy[Math.floor(Math.random() * proEasy.length)]._id,
    correct: false,
    score: 0,
  });
  arr.push({
    problemId: proNomal[Math.floor(Math.random() * proNomal.length)]._id,
    correct: false,
    score: 0,
  });
  arr.push({
    problemId: proHard[Math.floor(Math.random() * proHard.length)]._id,
    correct: false,
    score: 0,
  });
  return arr;
}

module.exports = {
  list,
  load,
  create,
  update,
  remove,
  get,
  GetRandomProblem,
};
