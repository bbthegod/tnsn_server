const CONST = require('../constants/const.js');
const config = require('../../config/config');
const User = require('../api/user/user.model');
const Play = require('../api/play/play.model');
const PlayController = require('../api/play/play.controller');
//defind 1000 choose
module.exports = function(socket) {
  try {
    return async function(data) {
      switch (data.comand) {
        case 1000: {
          let play = data.data;
          let result = await scoreCaculation(play);
          if (result) {
            var data = {
              code: 2,
              mesange: 'Tiếp tục',
              data: result,
            };
            if (global.hshUserSocket.hasOwnProperty(result.userID)) {
              const socketid = global.hshUserSocket[result.userID];
              global.hshIdSocket[socketid].emit(CONST.NAMESPACE.QUESTION, data);
            } else {
              console.log('Error, check user: ' + result.userID);
            }
          }
          break;
        }
        case 2000: {
          let play = data.data;
          if (play) {
            Play.findById(play.data._id).then((result) => {
              result.time = data.time;
              result.save();
            });
          }
          break;
        }
        case 3000: {
          User.findOne({ studentId: data.studentId }).then((user) => {
            Play.findOne({ userID: user._id }).then((play) => {
              play.status = 2;
              play.save();
              Play.findOne({
                userID: user._id,
              }).then(async (resultplay) => {
                if (resultplay) {
                  var ques = {
                    code: 2,
                    mesange: 'Tiếp tục',
                    data: resultplay,
                  };
                  if (global.hshUserSocket.hasOwnProperty(user._id)) {
                    const socketid = global.hshUserSocket[user._id];
                    global.hshIdSocket[socketid].emit(CONST.NAMESPACE.QUESTION, ques);
                  } else {
                    console.log('Error, check user: ' + user._id);
                  }
                }
              });
            });
          });
        }
      }
    };
  } catch (error) {
    console.log(error);
  }
};
async function scoreCaculation(play) {
  let result = await Play.findById(play._id)
    .populate('history.questions.questionId')
    .populate('history.problems.problemId');
  result.time = play.time;
  let score = 0;
  for (let i = 0; i < play.history.questions.length; i++) {
    if (play.history.questions[i].answer == result.history.questions[i].questionId.correctAnswer) {
      result.history.questions[i].answer = result.history.questions[i].questionId.correctAnswer;
      score += result.history.questions[i].questionId.score;
    } else {
      result.history.questions[i].answer = play.history.questions[i].answer;
    }
    if (play.history.questions[i].answer != 'false') {
      result.history.questions[i].answered = true;
    }
  }
  result.totalScore = score;
  result.save();
  return result;
}
