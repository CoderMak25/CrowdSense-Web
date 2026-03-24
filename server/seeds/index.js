require('dotenv').config({ path: '../.env' }); // Make sure we load the parent .env if needed
const mongoose = require('mongoose');
const { seedVenues } = require('./venueSeeds');
const { seedCrowdData } = require('./crowdSeeds');
const connectDB = require('../config/db');

// Add the redis client mock early if needed to avoid hanging, or just let them run
// since seeds only use Mongoose Models it shouldn't be an issue.

const runSeeds = async () => {
    try {
        await connectDB();
        console.log('Starting seed process...');
        
        await seedVenues();
        await seedCrowdData();
        
        console.log('Seed process completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seed process failed:', error);
        process.exit(1);
    }
};

runSeeds();
