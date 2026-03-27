const mongoose = require('mongoose');
const Venue = require('../models/Venue');
const connectDB = require('../config/db');

require('dotenv').config();

const venuesToSeed = [
    {
        venueId: "cst-mumbai",
        name: "Chhatrapati Shivaji Maharaj Terminus",
        type: "railway",
        address: "Dr. D.N. Road, Fort, Mumbai 400001",
        city: "Mumbai",
        location: { type: "Point", coordinates: [72.8355, 18.9398] },
        totalCapacity: 3000,
        isActive: true,
        zones: [
            { zoneId: "zone-a", name: "Main Concourse", maxCapacity: 800, warningThreshold: 0.6, criticalThreshold: 0.85, polygon: [[72.835,18.940],[72.836,18.940],[72.836,18.939],[72.835,18.939]] },
            { zoneId: "zone-b", name: "Platform 1-4", maxCapacity: 1200, warningThreshold: 0.6, criticalThreshold: 0.85, polygon: [[72.836,18.940],[72.837,18.940],[72.837,18.939],[72.836,18.939]] },
            { zoneId: "zone-c", name: "Exit Gates", maxCapacity: 400, warningThreshold: 0.55, criticalThreshold: 0.80, polygon: [[72.834,18.939],[72.835,18.939],[72.835,18.938],[72.834,18.938]] }
        ]
    },
    {
        venueId: "dadar-station",
        name: "Dadar Railway Station",
        type: "railway",
        address: "Dadar, Mumbai 400014",
        city: "Mumbai",
        location: { type: "Point", coordinates: [72.8426, 19.0178] },
        totalCapacity: 4000,
        isActive: true,
        zones: [
            { zoneId: "zone-a", name: "West Exit Bridge", maxCapacity: 600, warningThreshold: 0.6, criticalThreshold: 0.85 },
            { zoneId: "zone-b", name: "Platform 1-6", maxCapacity: 2000, warningThreshold: 0.6, criticalThreshold: 0.85 },
            { zoneId: "zone-c", name: "East Concourse", maxCapacity: 800, warningThreshold: 0.6, criticalThreshold: 0.85 }
        ]
    },
    {
        venueId: "lalbaug-pandal",
        name: "Lalbaugcha Raja Pandal",
        type: "pandal",
        address: "Lalbaug, Mumbai 400012",
        city: "Mumbai",
        location: { type: "Point", coordinates: [72.8347, 18.9967] },
        totalCapacity: 10000,
        isActive: true,
        zones: [
            { zoneId: "zone-a", name: "Entry Queue", maxCapacity: 3000, warningThreshold: 0.55, criticalThreshold: 0.75 },
            { zoneId: "zone-b", name: "Darshan Area", maxCapacity: 500, warningThreshold: 0.50, criticalThreshold: 0.70 },
            { zoneId: "zone-c", name: "Exit Corridor", maxCapacity: 1000, warningThreshold: 0.55, criticalThreshold: 0.75 }
        ]
    },
    {
        venueId: "andheri-station",
        name: "Andheri Railway Station",
        type: "railway",
        address: "Andheri East, Mumbai 400069",
        city: "Mumbai",
        location: { type: "Point", coordinates: [72.8479, 19.1197] },
        totalCapacity: 3500,
        isActive: true,
        zones: [
            { zoneId: "zone-a", name: "FOB Bridge", maxCapacity: 500, warningThreshold: 0.6, criticalThreshold: 0.80 },
            { zoneId: "zone-b", name: "Platform Area", maxCapacity: 1800, warningThreshold: 0.6, criticalThreshold: 0.85 }
        ]
    },
    {
        venueId: "bkc-mall",
        name: "BKC Jio World Drive Mall",
        type: "mall",
        address: "BKC, Bandra East, Mumbai 400051",
        city: "Mumbai",
        location: { type: "Point", coordinates: [72.8656, 19.0648] },
        totalCapacity: 5000,
        isActive: true,
        zones: [
            { zoneId: "zone-a", name: "Ground Floor Atrium", maxCapacity: 1000, warningThreshold: 0.6, criticalThreshold: 0.85 },
            { zoneId: "zone-b", name: "Food Court Level 2", maxCapacity: 800, warningThreshold: 0.65, criticalThreshold: 0.85 },
            { zoneId: "zone-c", name: "Parking Entry", maxCapacity: 600, warningThreshold: 0.60, criticalThreshold: 0.80 }
        ]
    }
];

const seedVenues = async () => {
    try {
        await connectDB();
        
        const count = await Venue.countDocuments();
        if (count > 0) {
            console.log("Already seeded");
            return { seeded: 0, message: "Venues already exist. Skipping." };
        }

        await Venue.insertMany(venuesToSeed);
        console.log("5 venues seeded ✅");
        return { seeded: 5, message: "5 venues seeded successfully." };
    } catch (error) {
        console.error("Error seeding venues:", error);
        throw error;
    }
};

// If run directly
if (require.main === module) {
    seedVenues().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { seedVenues, venuesToSeed };
