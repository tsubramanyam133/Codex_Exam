const mongoose = require('mongoose');
require('dotenv').config();
const Submission = require('./models/Submission');

const cleanup = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Deleting old submissions...');
    const result = await Submission.deleteMany({});
    
    console.log(`Successfully deleted ${result.deletedCount} old exams. Dashboard is clear!`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

cleanup();
