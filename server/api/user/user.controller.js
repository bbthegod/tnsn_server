const User = require('./user.model');

/**
 * Trả về người dùng và gắn vào request
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Trả về 1 người dùng
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Trả về người dùng hiện tại
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function getMe(req, res) {
  return res.json(req.auth);
}

/**
 * Trả về người dùng hiện tại
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function updateMe(req, res, next) {
  const { studentId, email, phone, name } = req.body;
  User.findOne({ studentId })
    .then(async (student) => {
      if (student && student.studentId != studentId) {
        res.status(400).json({
          code: 2,
          message: 'Đã tồn tại tài khoản',
        });
      } else {
        const user = req.auth;
        user.name = name;
        user.studentId = studentId;
        user.email = email;
        user.phone = phone;
        user
          .save()
          .then((result) => {
            return res.status(200).json(result);
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
 * Tạo 1 người dùng
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function create(req, res, next) {
  const { name, studentId, password, email, phone, role } = req.body;
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
          role,
        });
        user
          .save()
          .then((result) => {
            return res.status(200).json(result);
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
 * Cập nhật 1 người dùng
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function update(req, res, next) {
  const { name, studentId, password, email, phone, role } = req.body;
  User.findOne({ studentId })
    .then(async (student) => {
      if (student && student.studentId != studentId) {
        res.status(400).json({
          code: 2,
          message: 'Đã tồn tại tài khoản',
        });
      } else {
        const user = req.user;
        user.name = name;
        user.studentId = studentId;
        user.password = password;
        user.email = email;
        user.phone = phone;
        user.role = role;
        user
          .save()
          .then((result) => {
            return res.status(200).json(result);
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
 * Trả về danh sách người dùng
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0, filter, sort } = req.query;
  User.list({ limit, skip, filter, sort })
    .then((users) => res.json(users))
    .catch((e) => next(e));
}

/**
 * Xoá 1 người dùng
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function remove(req, res, next) {
  const user = req.user;
  user
    .remove()
    .then((deletedUser) => res.json(deletedUser))
    .catch((e) => next(e));
}

module.exports = { load, get, getMe, create, update, list, remove, updateMe };
