const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const STATUS = require('../../constants/status');

const questionListSchema = new mongoose.Schema(
  {
    name: String,
    usingQuestion: Number,
    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        point: Number,
      },
    ],
    isRandom: Boolean,
  },
  { collection: 'questionLists', timestamps: true },
);

/**
 * Statics
 */
questionListSchema.statics = {
  get(id) {
    return this.findById(id)
      .populate('questions.questionId')
      .exec()
      .then((questionList) => {
        if (questionList) {
          return questionList;
        }
        const err = new APIError('No such questionList exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  async list({
    skip = 0,
    limit = 500,
    sort = {
      createdAt: -1,
    },
    filter = {},
  }) {
    const data = await this.find(filter)
      .sort(sort)
      .skip(+skip)
      .limit(+limit)
      .populate('questions.questionId')
      .exec();
    const count = await this.find(filter).count();
    return {
      data,
      count,
      limit,
      skip,
    };
  },
};

module.exports = mongoose.model('QuestionList', questionListSchema);
