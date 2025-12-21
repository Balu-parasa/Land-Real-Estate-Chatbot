const mongoose = require('mongoose');

const propertySchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        city: String,
        state: String,
        price: {
            type: Number,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        size_unit: {
            type: String,
            default: 'acres',
        },
        description: String,
        images: [String],
        status: {
            type: String,
            enum: ['available', 'pending', 'sold'],
            default: 'available',
        },
        views_count: {
            type: Number,
            default: 0,
        },
        land_type: String,
        facing_direction: String,
        road_width_feet: Number,
        is_clear_title: {
            type: Boolean,
            default: false
        },
        water_available: {
            type: Boolean,
            default: false
        },
        electricity_available: {
            type: Boolean,
            default: false
        }
        // Add other fields as per frontend requirements if needed
    },
    {
        timestamps: true,
    }
);

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
