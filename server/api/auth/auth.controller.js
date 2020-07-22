const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const config = require('../../../config/config');
const User = require('../user/user.model');
const saltRounds = 10;
const mail = require('../../helpers/mailing.js');
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
            return res
              .json({
                code: 2,
                message: 'Người dùng bị khoá',
              })
              .end();
          } else if (user.isOnline) {
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
async function signup(req, res, next) {
  const { name, studentId, password, email, phone } = req.body;
  try {
    var studentIdExist = await User.findOne({ studentId }).exec();
    if (studentIdExist)
      return res.status(401).json({
        code: 2,
        message: 'ID already exists',
      });
    var emailExist = await User.findOne({ email }).exec();
    if (emailExist)
      return res.status(401).json({
        code: 2,
        message: 'Email already exists',
      });
    let code, codeExist;
    do {
      code = Math.floor(Math.random() * (999999 - 100000) + 100000);
      codeExist = await User.findOne({ activationCode: code }).exec();
    } while (codeExist);
    //=======================================================================
    var user = new User({
      phone,
      studentId,
      password,
      name,
      email,
      activationCode: code,
    });
    user
      .save()
      .then((result) => {
        mail.sendMail(user.email, code);
        return res.status(200).json({
          code: 1,
          message: 'Active your account',
        });
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    next(error);
  }
}

async function active(req, res, next) {
  const { studentId, code } = req.body;
  try {
    var user = await User.findOne({ activationCode: code, studentId })
      .exec()
      .catch((e) => next(e));
    if (user) {
      if (user.isActived)
        return res.status(200).json({
          code: 2,
          message: 'Account is actived',
        });
      await User.findByIdAndUpdate(user._id, { isLocked: false, isActived: true });
      return res.status(200).json({
        code: 1,
        message: 'Active your account',
      });
    } else {
      return res.status(401).json({
        code: 2,
        message: 'Activate failed',
      });
    }
  } catch (error) {
    next(error);
  }
}

async function resend(req, res, next) {
  const { studentId } = req.body;
  try {
    var user = await User.findOne({ studentId })
      .exec()
      .catch((e) => next(e));
    if (user) {
      if (user.isActived)
        return res.status(200).json({
          code: 2,
          message: 'Account is actived',
        });
      let code, codeExist;
      do {
        code = Math.floor(Math.random() * (999999 - 100000) + 100000);
        codeExist = await User.findOne({ activationCode: code }).exec();
      } while (codeExist);
      user.activationCode = code;
      user.save();
      mail.sendMail(user.email, code);
      return res.status(200).json({
        code: 1,
        message: 'Active your account',
      });
    } else {
      return res.status(401).json({
        code: 2,
        message: 'Resend failed',
      });
    }
  } catch (error) {
    next(error);
  }
}

async function change(req, res, next) {
  const { studentId, email } = req.body;
  try {
    var user = await User.findOne({ studentId })
      .exec()
      .catch((e) => next(e));
    if (user) {
      if (user.isActived)
        return res.status(200).json({
          code: 2,
          message: 'Account is actived',
        });
      user.email = email;
      user.save();
      return res.status(200).json({
        code: 1,
        message: 'Email changed',
      });
    } else {
      return res.status(401).json({
        code: 2,
        message: 'Resend failed',
      });
    }
  } catch (error) {
    next(error);
  }
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
      _id: user._id,
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

module.exports = { login, check, signup, active, resend, change };
