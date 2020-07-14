/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const Checkin = require('./checkin.model');

const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');
const STATUS = require('../../constants/status');

/**
 * Load checkin and append to req
 */
async function load(req, res, next, id) {
  // eslint-disable-next-line no-param-reassign
  req.checkin = await Checkin.findById(id);
  if (!req.checkin) {
    next(new APIError('Item not found', httpStatus.NOT_FOUND, true));
  }
  next();
}
/**
 * list checkin
 */
async function list(req, res, next) {
  try {
    const { limit = 500, skip = 0, sort, filter } = req.query;
    const checkins = await Checkin.list({ limit, skip, sort, filter });
    res.json(checkins);
  } catch (e) {
    next(e);
  }
}
/**
 * create checkin
 */
// eslint-disable-next-line consistent-return
async function create(req, res, next) {
  try {
    // eslint-disable-next-line max-len
    const { name, studentId } = req.body;
    const existCode = await Checkin.findOne({ studentId });
    if (existCode) {
      const err = new APIError('Exist checkin with code');
      return next(err);
    }
    const checkin = new Checkin({
      name,
      studentId,
    });

    return checkin
      .save()
      .then((savedcheckin) => {
        if (savedcheckin) res.json(savedcheckin);
        else res.transforemer.errorBadRequest('Can not create item');
      })
      .catch((e) => {
        next(e);
      });
  } catch (e) {
    next(e);
  }
}
/**
 * update checkin
 */
// eslint-disable-next-line consistent-return
async function update(req, res, next) {
  try {
    const { name, studentId, isExam } = req.body;
    const checkin = req.checkin;
    checkin.name = name;
    checkin.studentId = studentId;
    checkin.isExam = isExam;

    return checkin
      .save()
      .then(async (result) => {
        res.json(result);
      })
      .catch((err) => {
        next(err);
      });
  } catch (e) {
    next(e);
  }
}

/**
 * Remove costEstimate.
 * @returns checkin
 */
function remove(req, res, next) {
  const checkin = req.checkin;
  checkin
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
  res.json(req.checkin);
}

module.exports = {
  list,
  load,
  create,
  update,
  remove,
  get,
};
