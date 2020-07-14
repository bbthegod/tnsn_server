const Redis = require('redis');
const Bluebird = require('bluebird');
Bluebird.promisifyAll(Redis.RedisClient.prototype);
Bluebird.promisifyAll(Redis.Multi.prototype);

const client = Redis.createClient();

client.on('error', function(error) {
  console.error(error);
});

module.exports = client;
