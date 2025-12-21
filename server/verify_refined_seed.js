
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/Property');
const connectDB = require('./config/db');

dotenv.config();

const verifyData = async () => {
    try {
        await connectDB();

        // Just find one property and log it completely
        const prop = await Property.findOne({});
        console.log('--- Single Property Dump ---');
        console.log(JSON.stringify(prop, null, 2));

        const count = await Property.countDocuments();
        console.log(`Total count via Model: ${count}`);

        process.exit();

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyData();
