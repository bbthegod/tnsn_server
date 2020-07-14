const Joi = require('joi');

module.exports = {
  create: {
    body: {
      title: Joi.string().required(),
      content: Joi.string().required(),
      input: Joi.string().required(),
      output: Joi.string().required(),
      correctScore: Joi.string().required(),
      level: Joi.string().required(),
    },
  },
  update: {
    body: {
      title: Joi.string().required(),
      content: Joi.string().required(),
      input: Joi.string().required(),
      output: Joi.string().required(),
      correctScore: Joi.string().required(),
      level: Joi.string().required(),
    },
    params: {
      userId: Joi.string()
        .hex()
        .required(),
    },
  },
};
