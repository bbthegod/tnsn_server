const Joi = require('joi');

module.exports = {
  create: {
    body: {
      name: Joi.string().required(),
      studentId: Joi.string().required(),
    },
  },
  update: {
    body: {
      name: Joi.string().required(),
      studentId: Joi.string().required(),
      isExam: Joi.boolean().required(),
    },
    params: {
      checkinId: Joi.string()
        .hex()
        .required(),
    },
  },
};
