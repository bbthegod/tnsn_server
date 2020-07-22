const User = require('../api/user/user.model');
const CONST = require('../constants/const.js');

module.exports = function(socket) {
  try {
    return function(data) {
      if (global.hshSocketUser.hasOwnProperty(socket.id)) {
        User.findById(global.hshSocketUser[socket.id])
          .then((user) => {
            if (user) {
              user.isOnline = false;
              if (user.role == 'user') {
                global.userCount--;
              }

              socket.broadcast.emit(CONST.NAMESPACE.AUTH, {
                command: CONST.RETURN.AUTH.DISCONNECT,
                user: {
                  name: user.name,
                  studentId: user.studentId,
                },
              });

              if (global.hshIdSocket.hasOwnProperty(global.hshUserSocket[user._id])) {
                delete global.hshIdSocket.hasOwnProperty(global.hshUserSocket[user._id]);
              }

              delete global.hshSocketUser[socket.id];
              delete global.hshUserSocket[user._id];

              console.log(user.name + ', ' + user.studentId + ' just quit !');
              console.log(global.userCount + ' users online');
              return user.save();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
  } catch (error) {
    console.log(error);
  }
};
