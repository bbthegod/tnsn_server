const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const bcrypt = require('bcrypt');
/**
 * User Schema
 */
const UserSchema = new mongoose.Schema(
  {
    name: String,
    studentId: String,
    phone: String,
    class: String,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'judge', 'receptionist'],
    },
    timePassChange: Number,
    playId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Play',
    },
  },
  { collection: 'users', timestamps: true },
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({});

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  const rounds = 10;
  bcrypt.hash(this.password, rounds, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});
/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id, { createdAt: 0, updatedAt: 0, password: 0 })
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  async list({
    skip = 0,
    limit = 500,
    sort = {
      createdAt: -1,
    },
    filter = {},
  }) {
    /* eslint-disable no-param-reassign */
    const data = await this.find(filter, { createdAt: 0, updatedAt: 0, password: 0 })
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

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
