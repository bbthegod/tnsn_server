const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const STATUS = require('../../constants/status');

const checkinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    studentId: {
      type: String,
      unique: true,
    },
    isExam: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'checkins',
    timestamps: true,
  },
);

/**
 * Statics
 */
checkinSchema.statics = {
  /**
   * Get checkin
   *
   * @param {ObjectId} id - The objectId of checkin.
   * @returns {Promise<checkin, APIError>}
   */
  get(id) {
    return this.findOne({
      _id: id,
    })
      .exec()
      .then((checkin) => {
        if (checkin) {
          return checkin;
        }
        const err = new APIError('No such checkin exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List checkins in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of checkins to be skipped.
   * @param {number} limit - Limit number of checkins to be returned.
   * @returns {Promise<checkin[]>}
   */
  async list({
    skip = 0,
    limit = 500,
    sort = {
      createdAt: 1,
    },
    filter = {},
  }) {
    /* eslint-disable no-param-reassign */
    const data = await this.find(filter)
      .sort(sort)
      .skip(+skip)
      .limit(+limit)
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

module.exports = mongoose.model('Checkin', checkinSchema);
