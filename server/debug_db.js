
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const debugDB = async () => {
    try {
        await connectDB();
        console.log(`Connected to DB: ${mongoose.connection.name}`);
        console.log(`Host: ${mongoose.connection.host}`);

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const count = await mongoose.connection.db.collection('properties').countDocuments();
        console.log(`Raw Property Count: ${count}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugDB();
