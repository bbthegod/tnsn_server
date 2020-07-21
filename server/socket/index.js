const CONST = require('../constants/const.js');
var index = function(socket) {
  socket.emit(CONST.NAMESPACE.LOGIN, { message: 'welcome to socket server' }); //when socket connect
  socket.on(CONST.NAMESPACE.LOGIN, require('./start.js')(socket));
  socket.on(CONST.NAMESPACE.DISCONNECT, require('./disconect')(socket));
  socket.on(CONST.NAMESPACE.QUESTION, require('./question')(socket));
};

module.exports = index;
