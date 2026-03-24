const mongoose = require('mongoose');
const Venue = require('../models/Venue');
const User = require('../models/User');

const seedVenues = async () => {
  try {
    await Venue.deleteMany();
    await User.deleteMany(); // Reset users too for clean slate

    // Seed Admin User
    const adminUser = new User({
      name: 'Admin Operator',
      email: 'operator@crowdsense.ai',
      password: 'password123', // Will be hashed by pre-save
      role: 'admin',
      venueAccess: ['csmt01', 'dadar02', 'phoenix03', 'lalbaug04', 'wankhede05']
    });
    await adminUser.save();

    console.log("Admin user seeded: operator@crowdsense.ai / password123");

    const venues = [
      {
        venueId: 'csmt01',
        name: 'CSMT Railway Station',
        type: 'railway',
        location: { lat: 18.9398, lng: 72.8355, address: 'Chhatrapati Shivaji Maharaj Terminus, Mumbai' },
        sensors: { cctv: true, wifi: true, ble: true },
        zones: [
          {
            zoneId: 'z_csmt_p1',
            name: 'Platform 1',
            capacity: 800,
            thresholds: { low: 200, medium: 450, high: 600, critical: 750 }
          },
          {
            zoneId: 'z_csmt_p2',
            name: 'Platform 2',
            capacity: 800,
            thresholds: { low: 200, medium: 450, high: 600, critical: 750 }
          },
          {
            zoneId: 'z_csmt_main',
            name: 'Concourse Main',
            capacity: 2500,
            thresholds: { low: 500, medium: 1200, high: 1800, critical: 2300 }
          },
          {
            zoneId: 'z_csmt_gatea',
            name: 'Gate A',
            capacity: 400,
            thresholds: { low: 100, medium: 200, high: 300, critical: 380 }
          }
        ]
      },
      {
        venueId: 'dadar02',
        name: 'Dadar Railway Station',
        type: 'railway',
        location: { lat: 19.0178, lng: 72.8478, address: 'Dadar Station, Mumbai' },
        sensors: { cctv: true, ble: true },
        zones: [
          {
            zoneId: 'z_ddr_p3',
            name: 'Platform 3',
            capacity: 1000,
            thresholds: { low: 250, medium: 500, high: 750, critical: 900 }
          },
          {
            zoneId: 'z_ddr_p4',
            name: 'Platform 4',
            capacity: 1000,
            thresholds: { low: 250, medium: 500, high: 750, critical: 900 }
          },
          {
            zoneId: 'z_ddr_bridge',
            name: 'Bridge',
            capacity: 500,
            thresholds: { low: 150, medium: 300, high: 400, critical: 480 }
          },
          {
            zoneId: 'z_ddr_east',
            name: 'East Exit',
            capacity: 600,
            thresholds: { low: 150, medium: 350, high: 450, critical: 550 }
          }
        ]
      },
      {
        venueId: 'phoenix03',
        name: 'Phoenix Palladium Mall',
        type: 'mall',
        location: { lat: 18.9931, lng: 72.8270, address: 'Lower Parel, Mumbai' },
        sensors: { cctv: true, wifi: true },
        zones: [
          {
            zoneId: 'z_phx_ground',
            name: 'Ground Floor',
            capacity: 3000,
            thresholds: { low: 800, medium: 1500, high: 2200, critical: 2800 }
          },
          {
            zoneId: 'z_phx_food',
            name: 'Food Court',
            capacity: 1200,
            thresholds: { low: 300, medium: 600, high: 900, critical: 1100 }
          },
          {
            zoneId: 'z_phx_gate',
            name: 'Entry Gate',
            capacity: 500,
            thresholds: { low: 100, medium: 250, high: 380, critical: 450 }
          },
          {
            zoneId: 'z_phx_park',
            name: 'Parking',
            capacity: 800,
            thresholds: { low: 200, medium: 400, high: 600, critical: 750 }
          }
        ]
      },
      {
        venueId: 'lalbaug04',
        name: 'Lalbaugcha Raja Pandal',
        type: 'pandal',
        location: { lat: 18.9934, lng: 72.8323, address: 'Lalbaug, Mumbai' },
        sensors: { gps: true, sms: true, cctv: true },
        zones: [
          {
            zoneId: 'z_lb_main',
            name: 'Main Darshan',
            capacity: 5000,
            thresholds: { low: 1000, medium: 2500, high: 4000, critical: 4800 }
          },
          {
            zoneId: 'z_lb_q1',
            name: 'Queue Zone 1',
            capacity: 3000,
            thresholds: { low: 800, medium: 1500, high: 2500, critical: 2900 }
          },
          {
            zoneId: 'z_lb_q2',
            name: 'Queue Zone 2',
            capacity: 3000,
            thresholds: { low: 800, medium: 1500, high: 2500, critical: 2900 }
          },
          {
            zoneId: 'z_lb_exit',
            name: 'Exit Route',
            capacity: 1500,
            thresholds: { low: 400, medium: 800, high: 1200, critical: 1400 }
          }
        ]
      },
      {
        venueId: 'wankhede05',
        name: 'Wankhede Stadium',
        type: 'stadium',
        location: { lat: 18.9388, lng: 72.8254, address: 'Churchgate, Mumbai' },
        sensors: { appEvents: true, cctv: true },
        zones: [
          {
            zoneId: 'z_wk_north',
            name: 'North Stand',
            capacity: 8000,
            thresholds: { low: 2000, medium: 4000, high: 6000, critical: 7500 }
          },
          {
            zoneId: 'z_wk_south',
            name: 'South Stand',
            capacity: 8000,
            thresholds: { low: 2000, medium: 4000, high: 6000, critical: 7500 }
          },
          {
            zoneId: 'z_wk_main',
            name: 'Main Entry',
            capacity: 4000,
            thresholds: { low: 1000, medium: 2000, high: 3000, critical: 3800 }
          },
          {
            zoneId: 'z_wk_vip',
            name: 'VIP Gate',
            capacity: 1000,
            thresholds: { low: 300, medium: 500, high: 800, critical: 950 }
          }
        ]
      }
    ];

    await Venue.insertMany(venues);
    console.log('5 Mumbai Venues Seeded');

  } catch (error) {
    console.error('Data destruction/creation error: ', error);
  }
};

module.exports = { seedVenues };
