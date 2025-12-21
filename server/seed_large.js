
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/Property');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const landTypes = ['Agricultural', 'Residential', 'Commercial', 'Industrial', 'Farmhouse'];
const directions = ['North', 'South', 'East', 'West', 'North-East', 'South-West'];
const cities = [
    { name: 'Austin', state: 'Texas' },
    { name: 'Portland', state: 'Oregon' },
    { name: 'Orlando', state: 'Florida' },
    { name: 'Denver', state: 'Colorado' },
    { name: 'Phoenix', state: 'Arizona' },
    { name: 'Nashville', state: 'Tennessee' },
    { name: 'Seattle', state: 'Washington' },
    { name: 'Boise', state: 'Idaho' },
    { name: 'Raleigh', state: 'North Carolina' },
    { name: 'Atlanta', state: 'Georgia' }
];

const adjectives = ['Beautiful', 'Prime', 'Spacious', 'Scenic', 'Secluded', 'Luxury', 'Affordable', 'Exclusive', 'Rare', 'Sunny'];
const nouns = ['Estate', 'Plot', 'Ranch', 'Farm', 'Land', 'Acreage', 'Corner Lot', 'Retreat', 'Orchard', 'Meadow'];

const generateProperties = (count, userId) => {
    const properties = [];
    for (let i = 0; i < count; i++) {
        const cityObj = cities[Math.floor(Math.random() * cities.length)];
        const landType = landTypes[Math.floor(Math.random() * landTypes.length)];
        const facing = directions[Math.floor(Math.random() * directions.length)];
        
        const size = parseFloat((Math.random() * 50 + 0.5).toFixed(2));
        const pricePerAcre = Math.floor(Math.random() * 50000 + 5000);
        const price = Math.floor(size * pricePerAcre);

        const title = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${landType} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
        
        properties.push({
            owner: userId,
            title: title,
            location: `${cityObj.name}, ${cityObj.state}`,
            city: cityObj.name,
            state: cityObj.state,
            price: price,
            size: size,
            size_unit: 'acres',
            description: `An incredible opportunity to own ${size} acres of ${landType.toLowerCase()} land in ${cityObj.name}. This property functionality features ${facing} facing views, ready for development or investment. Close to major highways and amenities. Detailed survey available upon request. \n\nKey Highlights:\n- ${facing} Facing\n- ${landType} Zoning\n- Great Investment Potential`,
            images: [
                `https://images.unsplash.com/photo-${['1500382017468-9049fed747ef', '1448375240586-dfd8d395ea6c', '1501785888041-af3ef285b470', '1516156008625-3a9d60270552', '1470071459604-3b5ec3a7fe05'][Math.floor(Math.random() * 5)]}?w=800`
            ],
            status: Math.random() > 0.8 ? 'sold' : 'available',
            land_type: landType,
            facing_direction: facing,
            views_count: Math.floor(Math.random() * 500),
            is_clear_title: true,
            water_available: Math.random() > 0.3,
            electricity_available: Math.random() > 0.2,
            has_loan: true
        });
    }
    return properties;
};

const seedLargeDataset = async () => {
    try {
        await connectDB();

        const admin = await User.findOne({ email: 'admin@example.com' });
        if (!admin) {
            console.error('Admin user not found. Run seed.js first.');
            process.exit(1);
        }

        console.log('Clearing existing properties...');
        await Property.deleteMany({});

        console.log('Generating 60 varied properties...');
        const properties = generateProperties(60, admin._id);

        await Property.insertMany(properties);

        console.log('✅ Successfully seeded 60 properties!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedLargeDataset();
