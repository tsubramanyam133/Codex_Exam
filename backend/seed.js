require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');
const questionsData = require('./questions.json');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing
    await Question.deleteMany({});
    console.log('Cleared existing questions');
    
    // Seed data
    await Question.insertMany(questionsData);
    console.log('Seeded questions successfully');
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
  });
