const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Question = require('./models/Question');
const Submission = require('./models/Submission');

const app = express();

app.use(cors());
app.use(express.json());

const questionsData = require('./questions.json');

const startDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Live MongoDB Atlas Cluster');

    // Only seed the database with questions if it is currently empty
    const questionCount = await Question.countDocuments();
    if (questionCount === 0) {
      await Question.insertMany(questionsData);
      console.log('Seeded 30 questions into the live database successfully');
    } else {
      console.log('Database already contains questions. Skipping seed.');
    }
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

startDB();


// Routes

// 1. Authentication (Login / Register)
app.post('/api/login', async (req, res) => {
  const { userId, phoneNumber } = req.body;
  if (!userId || !phoneNumber) {
    return res.status(400).json({ error: 'User ID and Phone Number are required.' });
  }

  try {
    let user = await User.findOne({ userId });
    if (!user) {
      // Register if it doesn't exist
      user = new User({ userId, phoneNumber });
      await user.save();
    } else {
      if (user.phoneNumber !== phoneNumber) {
        return res.status(401).json({ error: 'Invalid phone number for this User ID.' });
      }
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Fetch Questions
app.get('/api/questions', async (req, res) => {
  try {
    // Exclude the correctOptionIndex so frontend doesn't cheat
    const questions = await Question.find({}).select('-correctOptionIndex');
    res.json(questions);
  } catch (error) {
    console.error('Fetch questions error:', error);
    res.status(500).json({ error: 'Server error fetching questions' });
  }
});

// 3. Submit Answers
app.post('/api/submit', async (req, res) => {
  const { userId, answers, timeTakenSeconds } = req.body;
  
  if (!userId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid submission data.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    let score = 0;
    let detailedResults = [];
    // Calculate score
    for (let ans of answers) {
      const q = await Question.findById(ans.questionId);
      if (q) {
        const isCorrect = q.correctOptionIndex === ans.selectedOptionIndex;
        if (isCorrect) {
          score++;
        }
        detailedResults.push({
          questionText: q.questionText,
          selectedOption: ans.selectedOptionIndex !== undefined && ans.selectedOptionIndex !== null ? q.options[ans.selectedOptionIndex] : 'Not Answered',
          correctOption: q.options[q.correctOptionIndex],
          isCorrect
        });
      }
    }

    const submission = new Submission({
      userId: user._id,
      answers,
      score,
      timeTakenSeconds: timeTakenSeconds || 0
    });

    await submission.save();

    res.json({ message: 'Exam submitted successfully.', score, total: answers.length, detailedResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error saving submission.' });
  }
});

// 4. Admin fetch all submissions
app.get('/api/admin/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find({})
      .populate('userId', 'userId phoneNumber')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Admin fetch error:', error);
    res.status(500).json({ error: 'Server error fetching submissions' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
