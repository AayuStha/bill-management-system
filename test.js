const mongoose = require('mongoose');

const uri = 'mongodb+srv://contact:hihellohi12@billmanagementcluster.qsryo.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connection successful');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
