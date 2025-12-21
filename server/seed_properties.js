
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/Property');
const User = require('./models/User');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');

dotenv.config();

const sellersData = [
    {
        full_name: 'Rajesh Kumar',
        email: 'rajesh@landchat.com',
        password: 'password123',
        phone: '+91 98480 12345',
        role: 'admin',
        avatar_url: ''
    },
    {
        full_name: 'Suresh Reddy',
        email: 'suresh@landchat.com',
        password: 'password123',
        phone: '+91 99890 67890',
        role: 'admin',
        avatar_url: ''
    },
    {
        full_name: 'Anita Desai',
        email: 'anita@landchat.com',
        password: 'password123',
        phone: '+91 70321 54321',
        role: 'admin',
        avatar_url: ''
    }
];

const seedProperties = async () => {
    try {
        await connectDB();

        // 1. Create/Update Sellers
        const sellerIds = [];
        for (const sellerData of sellersData) {
            let user = await User.findOne({ email: sellerData.email });
            if (user) {
                user.full_name = sellerData.full_name;
                user.phone = sellerData.phone;
                user.role = sellerData.role;
                await user.save();
            } else {
                user = await User.create(sellerData);
            }
            sellerIds.push(user._id);
        }

        // 2. Clear Existing Properties
        await Property.deleteMany({});
        console.log('Cleared existing properties.');

        // 3. Load Real Properties Dataset
        const propertiesPath = path.join(__dirname, 'properties_dataset.json');
        const rawData = fs.readFileSync(propertiesPath, 'utf-8');
        const propertiesData = JSON.parse(rawData);

        // 4. Distribute Properties among Sellers
        const allProperties = propertiesData.map((prop, index) => {
            // Assign to sellers in a round-robin fashion
            const sellerId = sellerIds[index % sellerIds.length];
            return {
                ...prop,
                owner: sellerId,
                // Ensure specific fields are present if missing in JSON (though they should be there)
                title: prop.title || 'Untitled Property',
                description: prop.description || 'No description provided.',
                images: prop.images || [],
                location: prop.location || 'Unknown Location'
            };
        });

        // 5. Insert Properties
        await Property.insertMany(allProperties);
        console.log(`Successfully seeded ${allProperties.length} REAL properties!`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedProperties();
