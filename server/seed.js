const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedUsers = async () => {
    try {
        await connectDB();

        // Check if users exist
        const userExists = await User.findOne({ email: 'user@example.com' });
        if (userExists) {
            console.log('Users already seeded');
            process.exit();
        }

        const users = [
            {
                full_name: 'Demo Admin',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                phone: '1234567890'
            },
            {
                full_name: 'Demo User',
                email: 'user@example.com',
                password: 'password123',
                role: 'customer',
                phone: '0987654321'
            }
        ];

        await User.create(users);

        console.log('Users seeded successfully');
        console.log('Admin: admin@example.com / password123');
        console.log('User: user@example.com / password123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedUsers();
