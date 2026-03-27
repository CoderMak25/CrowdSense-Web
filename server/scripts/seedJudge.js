const mongoose = require('mongoose');
const connectDB = require('../config/db');
const AlertSubscription = require('../models/AlertSubscription');
const Venue = require('../models/Venue');
const { seedVenues, venuesToSeed } = require('./seedVenues');
require('dotenv').config();

const runSeed = async (phone) => {
    try {
        if (!phone) {
            console.error("Usage: node seedJudge.js +91XXXXXXXXXX");
            process.exit(1);
        }

        await connectDB();

        // 1. Ensure Venues are seeded first
        const count = await Venue.countDocuments();
        if (count === 0) {
            console.log("Venues not found. Seeding now...");
            await seedVenues();
        } else {
            console.log(`Verified ${count} venues exist.`);
        }

        // 2. Clear old subscriptions for this number if any exist
        await AlertSubscription.deleteMany({ phone });
        console.log(`Cleared previous subscriptions for ${phone}`);

        // 3. Subscribe judge to ALL 5 venues
        const subs = venuesToSeed.map(v => ({
            venueId: v.venueId,
            phone,
            name: "Hackathon Judge",
            viaWhatsapp: true,
            viaSms: true,
            severityFilter: 'WARNING', // They get both warnings and criticals
        }));

        await AlertSubscription.insertMany(subs);

        console.log("");
        console.log("=========================================");
        console.log(`Judge ${phone} subscribed to ${venuesToSeed.length} venues ✅`);
        for(const v of venuesToSeed) {
             console.log(`  - Subscribed to: ${v.name}`);
        }
        console.log("=========================================");
        console.log("Demo readiness status at the end: READY 🟢");
        
        process.exit(0);
    } catch (e) {
        console.error("Error setting up judge:", e);
        process.exit(1);
    }
};

const phoneArgs = process.argv.slice(2)[0];
runSeed(phoneArgs);
