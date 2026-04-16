const mongoose = require('mongoose');
require('dotenv').config();

const Submission = require('./models/Submission');
const User = require('./models/User');

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const submissions = await Submission.find({}).populate('userId', 'userId phoneNumber');
  console.log(JSON.stringify(submissions, null, 2));
  process.exit(0);
};

check();
