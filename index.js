const mongoose = require('mongoose');
const util = require('util');
const http = require('http');
const socket = require('socket.io');

// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
const debug = require('debug')('nodejs-api-kit:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  poolSize: 2,
});
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

var server = http.createServer(app);
global.io = socket(server, {
  transports: ['websocket', 'polling'],
});
global.hshSocketUser = {};
global.hshUserSocket = {};
global.hshIdSocket = {};
global.hshUserTimeout = {};

global.userCount = 0;
global.userCurrentPlay = {};

if (!module.parent) {
  // listen on port config.port

  server.listen(config.port, () => {
    console.log('\x1b[33m%s\x1b[0m', `Server started on port ${config.port} (${config.env})`);
    global.io.on('connection', require('./server/socket/index'));
  });
}

module.exports = app;
