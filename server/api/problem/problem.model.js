const mongoose = require('mongoose');
const problemSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    input: String,
    output: String,
    correctScore: Number,
    level: Number,
  },
  { collection: 'problems', timestamps: true },
);

/**
 * Statics
 */
problemSchema.statics = {
  get(id) {
    return this.findOne({
      _id: id,
    })
      .exec()
      .then((question) => {
        if (question) {
          return question;
        }
        const err = new APIError('No such question exists!', httpStatus.NOT_FOUND);
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

module.exports = mongoose.model('Problem', problemSchema);
