const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedOptionIndex: { type: Number, required: true }
  }],
  score: { type: Number, default: 0 },
  timeTakenSeconds: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
