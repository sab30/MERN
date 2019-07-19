// Contains mongo db connection 
const mongoose = require('mongoose');

const config = require('config');

const db = config.get('mongoURI');

// Creatae  async arrow function 
const connectDB = async () => {
    try {
        await mongoose.connect(db,{ 
            useNewUrlParser: true ,
            useCreateIndex: true,
            useFindAndModify : false
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error.messge);
        // Exit process with failure
        process.exit(1);
    }
};

// Finally export the connection 

module.exports = connectDB;
