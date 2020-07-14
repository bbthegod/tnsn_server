const Joi = require('joi');

module.exports = {
  create: {
    body: {
      name: Joi.string().required(),
      questions: Joi.string().required(),
      usingQuestion: Joi.object().required(),
      isRandom: Joi.string().required(),
    },
  },
  update: {
    body: {
      name: Joi.string().required(),
      questions: Joi.string().required(),
      usingQuestion: Joi.object().required(),
      isRandom: Joi.string().required(),
    },
  },
};
