const Joi = require('joi');

module.exports = {
  create: {
    body: {
      content: Joi.string().required(),
      answer1: Joi.string().required(),
      answer2: Joi.string().required(),
      answer3: Joi.string().required(),
      answer4: Joi.string().required(),
      correctAnswer: Joi.string().required(),
      score: Joi.number().required(),
    },
  },
  update: {
    body: {
      content: Joi.string().required(),
      answer1: Joi.string().required(),
      answer2: Joi.string().required(),
      answer3: Joi.string().required(),
      answer4: Joi.string().required(),
      correctAnswer: Joi.string().required(),
      score: Joi.number().required(),
    },
  },
};
