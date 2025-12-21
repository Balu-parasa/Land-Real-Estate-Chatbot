const mongoose = require('mongoose');
const Property = require('./models/Property');
require('dotenv').config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/landchat';
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const testQuery = async () => {
    await connectDB();

    // Test query for "above 50 lakhs"
    const price = 5000000;
    const query = { status: 'available', price: { $gte: price } };

    console.log("Running Query:", JSON.stringify(query));

    const properties = await Property.find(query).sort({ createdAt: -1 }).limit(5);

    console.log(`Found ${properties.length} properties.`);
    properties.forEach(p => {
        console.log(`- ${p.title}: ${p.price}`);
    });

    process.exit();
};

testQuery();
