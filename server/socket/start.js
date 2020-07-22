const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const CONST = require('../constants/const.js');
const config = require('../../config/config');
const User = require('../api/user/user.model');

module.exports = function(socket) {
  try {
    return function(data) {
      if (data.command == CONST.RECEIVE.LOGIN.AUTH) {
        var token = data.token;
        if (token) {
          jwt.verify(token, config.jwtSecret, function(err, decoded) {
            if (err) {
              errorWithMessage(socket, 'Authentication failed.');
            } else {
              User.findById(decoded._id, function(err, user) {
                if (err) throw err;
                if (!user) {
                  errorWithMessage(socket, 'Authentication failed.');
                  return;
                } else if (user.isLocked) {
                  errorWithMessage(socket, 'User is locked.');
                  return;
                } else if (user) {
                  if (global.hshUserSocket.hasOwnProperty(user.id)) {
                    errorWithMessage(socket, 'User already online.');
                    return;
                  }
                  success(socket, user);
                }
              });
            }
          });
        } else {
          errorWithMessage(socket, 'Authentication failed.');
        }
      }
    };
  } catch (error) {
    console.log(error);
  }
};
function errorWithMessage(socket, message) {
  socket.emit(CONST.NAMESPACE.AUTH, {
    command: CONST.RETURN.AUTH.LOGIN,
    code: 2,
    message: message,
  });
  socket.disconnect('unauthorized');
}
function success(socket, user) {
  if (user.role == 'user') {
    socket.broadcast.emit(CONST.NAMESPACE.AUTH, {
      command: CONST.RETURN.AUTH.USER_GO_ONLINE,
      user: {
        name: user.name,
        studentId: user.studentId,
      },
    });
    global.userCount++;
  }
  user.isOnline = true;
  global.hshSocketUser[socket.id] = user._id;
  global.hshUserSocket[user._id] = socket.id;
  global.hshIdSocket[socket.id] = socket;
  user.save();
  console.log(global.userCount + ' users online now');
  console.log(user.name + ' - ' + user.studentId + ' is online');
}
