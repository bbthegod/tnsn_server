const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production', 'test', 'provision']).default('development'),
  PORT: Joi.number().default(4040),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  JWT_SECRET: Joi.string().required().description('JWT Secret required to sign'),
  MASTER_SECRET: Joi.string(),
  MONGO_HOST: Joi.string().required().description('Mongo DB host url'),
  MONGO_PORT: Joi.number().default(27017),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  masterSecret: envVars.MASTER_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
  },
  NAMESPACE: {
    LOGIN: 'login',
    AUTH: 'auth',
    ADMIN: 'admin',
    VIEWER: 'viewer',
    USER: 'user',
    QUESTION: 'question',
    DISCONNECT: 'disconnect',
  },
  ROOMS: {
    ADMIN: 'admin room',
    VIEWER: 'viewer room',
    USER: 'user room',
  },

  RECEIVE: {
    //1000
    LOGIN: {
      AUTH: 1000,
    },
  },
  RETURN: {
    //1000
    AUTH: {
      LOGIN: 1000,
      USER_GO_ONLINE: 1001,
      DISCONNECT: 1002,
    },
    QUEST: {
      RAISE: 2000,
      CHOOSE_ANSWER: 2001,
      FINISHED_ROUTE: 2002,
    },
  },
};

module.exports = config;
