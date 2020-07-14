const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const STATUS = require('../../constants/status');

const playSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    history: {
      questions: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
          },
          answered: Boolean,
          answer: String,
        },
      ],
      problems: [
        {
          problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Problem',
          },
          correct: Boolean,
          score: Number,
        },
      ],
    },
    time: {
      type: Number,
      default: 60 * 60,
    },
    status: {
      type: Number,
      default: 0,
    }, //0: init, 1: playing, 2: end
    totalScore: {
      type: Number,
      default: 0,
    },
    totalTime: {
      type: Number,
      default: 60 * 60,
    },
  },
  { collection: 'plays', timestamps: true },
);

/**
 * Statics
 */
playSchema.statics = {
  get(id) {
    return this.findOne({
      _id: id,
    })
      .exec()
      .then((play) => {
        if (play) {
          return play;
        }
        const err = new APIError('No such play exists!', httpStatus.NOT_FOUND);
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
      .populate('userID', 'name studentId phone class email')
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

module.exports = mongoose.model('Play', playSchema);
