const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const cache = require('../../cache');

const questionSchema = new mongoose.Schema(
  {
    content: String,
    options: [
      {
        numbering: String,
        answer: String,
      },
    ],
    correctAnswer: String,
    score: Number,
  },
  {
    timestamps: true,
    collection: 'questions',
  },
);
// questionSchema.pre('find', function(next) {
//   if (!this.isModified('password')) return next();
//   const rounds = 10;
//   bcrypt.hash(this.password, rounds, (err, hash) => {
//     if (err) return next(err);
//     this.password = hash;
//     next();
//   });
// });
questionSchema.statics = {
  async get(id) {
    let question = await this.findById(id);
    return question;
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

module.exports = mongoose.model('Question', questionSchema);
