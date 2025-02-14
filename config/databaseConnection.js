require('dotenv').config();
const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log('Connected to MongoDB'))
            .catch(err => console.error('MongoDB connection error:', err));
    } catch (error) {
        console.error(error);
    }
}

module.exports = connectDatabase;
