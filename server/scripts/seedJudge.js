require('dotenv').config();
const mongoose = require('mongoose');
const AlertSubscription = require('../models/AlertSubscription');
const connectDB = require('../config/db');

const seedJudge = async () => {
    const phone = process.argv[2];
    if (!phone) {
        console.error("Usage: node server/scripts/seedJudge.js +91XXXXXXXXXX");
        process.exit(1);
    }

    try {
        await connectDB();
        
        const venues = ["cst-mumbai", "dadar-central", "byculla", "kurla", "ghatkopar"];
        
        for (const venueId of venues) {
            await AlertSubscription.findOneAndUpdate(
                { venueId, phone },
                { 
                    name: "Judge", 
                    viaWhatsapp: true, 
                    viaSms: true, 
                    severityFilter: "WARNING",
                    createdAt: new Date()
                },
                { upsert: true }
            );
        }

        console.log(`Judge ${phone} subscribed to 5 venues ✅`);
        process.exit(0);
    } catch (error) {
        console.error("Seed Error:", error);
        process.exit(1);
    }
};

seedJudge();
