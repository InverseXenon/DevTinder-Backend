const mongoose = require('mongoose');

const connectDB = async () => {  
    await mongoose.connect(
      process.env.Database_Connection_String
    );
};

module.exports = connectDB;

