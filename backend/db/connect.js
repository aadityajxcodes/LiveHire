const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Auto build indexes in production
      autoIndex: true,
      // Set timeout to 30 seconds
      serverSelectionTimeoutMS: 30000,
      // Set socket timeout to 45 seconds
      socketTimeoutMS: 45000,
    };

    // Encode the password to handle special characters
    const username = 'ayushnema365';
    const password = encodeURIComponent('aayush@123');
    const MONGODB_URI = `mongodb+srv://${username}:${password}@cluster0.yn6dvpb.mongodb.net/livehire?retryWrites=true&w=majority`;

    await mongoose.connect(MONGODB_URI, connectionOptions);
    console.log('Connected to MongoDB Atlas successfully!');

    // Handle connection errors after initial connection
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully!');
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Exit process with failure if initial connection fails
    process.exit(1);
  }
};

module.exports = connectDB;

