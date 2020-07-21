const Joi = require('joi');

module.exports = {
  // POST /api/auth/login
  login: {
    body: {
      studentId: Joi.string().required(),
      password: Joi.string().required(),
    },
  },
  // POST /api/auth/signup
  signup: {
    body: {
      phone: Joi.string().required(),
      studentId: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
    },
  },
  activeAccount: {
    body: {
      studentId: Joi.string().required(),
      code: Joi.string().required(),
    },
  },
  resend: {
    body: {
      studentId: Joi.string().required(),
    },
  },
  change: {
    body: {
      studentId: Joi.string().required(),
      email: Joi.string().required(),
    },
  },
};
