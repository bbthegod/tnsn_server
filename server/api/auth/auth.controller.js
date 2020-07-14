const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const config = require('../../../config/config');
const User = require('../user/user.model');
const saltRounds = 10;

/**
 * Trả về token và thông tin nếu đăng nhập thành công
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  const { studentId, password } = req.body;
  User.findOne({
    studentId,
  })
    .then(async (user) => {
      if (!user) {
        return errorResponse(next);
      }
      bcrypt.compare(password, user.password, function(err, decode) {
        if (decode) {
          if (user.isLocked) {
            user.isOnline = false;
            user.save();
            return res
              .json({
                code: 2,
                message: 'Người dùng bị khoá',
              })
              .end();
          } else if (user.isOnline) {
            user.isOnline = false;
            user.save();
            return res
              .json({
                code: 2,
                message: 'Người dùng đang online',
              })
              .end();
          } else {
            return successResponse(user, res);
          }
        } else {
          errorResponse(next);
        }
      });
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Đăng xuất
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function logout(req, res, next) {
  try {
    const user = req.auth;
    user.isOnline = false;
    user
      .save()
      .then(() => res.status(200).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
}

/**
 * Trả về thành công nếu token hợp lệ
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function check(req, res, next) {
  res.status(200).json({
    code: 1,
  });
}

/**
 * Trả về token và thông tin nếu đăng kí thành công
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function signup(req, res, next) {
  const { name, studentId, password, email, phone } = req.body;
  User.findOne({ studentId })
    .then(async (student) => {
      if (student) {
        res.status(400).json({
          code: 2,
          message: 'Đã tồn tại tài khoản',
        });
      } else {
        var user = new User({
          phone,
          studentId,
          password,
          name,
          email,
        });
        user
          .save()
          .then((result) => {
            successResponse(user, res);
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Đăng kí token và trả về
 * @param req
 * @param res
 * @returns {*}
 */
function successResponse(user, res) {
  user.isOnline = true;
  user.save();
  const token = jwt.sign(
    {
      studentId: user.studentId,
    },
    config.jwtSecret,
  );
  return res.status(200).json({
    code: 1,
    token,
    user: {
      name: user.name,
      role: user.role,
      studentId: user.studentId,
    },
  });
}

/**
 * Trả về lỗi đăng nhập
 * @param req
 * @param res
 * @returns {*}
 */
function errorResponse(next) {
  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  return next(err);
}

module.exports = { login, logout, check, signup };
