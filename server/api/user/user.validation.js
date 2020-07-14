const Joi = require('joi');

module.exports = {
  // POST /api/users
  create: {
    body: {
      phone: Joi.string().required(),
      studentId: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
    },
  },

  // UPDATE /api/users/:userId
  update: {
    body: {
      phone: Joi.string().required(),
      studentId: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
    },
    params: {
      userId: Joi.string()
        .hex()
        .required(),
    },
  },
};
