require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cron = require('node-cron');

const connectDB = require('./config/db');
const { initWebSocket, broadcastToVenue } = require('./websocket/wsManager');
const { errorHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimit');

// Services
const Venue = require('./models/Venue');
const { runFusionForZone } = require('./services/kalmanFusion');

// Routes
const authRoutes = require('./routes/auth');
const venueRoutes = require('./routes/venues');
const densityRoutes = require('./routes/density');
const ingestRoutes = require('./routes/ingest');
const alertsRoutes = require('./routes/alerts');
const analyticsRoutes = require('./routes/analytics');
const demoRoutes = require('./routes/demo');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Apply standard rate limit to API routes unless overridden
// Ingest routes have their own limits
app.use('/api', (req, res, next) => {
    if (req.path.startsWith('/ingest')) return next();
    generalLimiter(req, res, next);
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/density', densityRoutes);
app.use('/api/ingest', ingestRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/demo', demoRoutes);

// Healthcheck
app.get('/health', (req, res) => res.send('OK'));

// Global Error Handler must be last middleware
app.use(errorHandler);

// HTTP Server
const server = http.createServer(app);

// Attach WebSocket Server
initWebSocket(server);

// --- CRON JOBS ---

// Every 30 seconds: Trigger system-wide fusion for active venues
cron.schedule('*/30 * * * * *', async () => {
    try {
        const activeVenues = await Venue.find({ isActive: true });
        for (const venue of activeVenues) {
             for (const zone of venue.zones) {
                  // This service fetches recent raw data, computes estimated count, saves and triggers alerts
                  await runFusionForZone(venue.venueId, zone.zoneId);
             }
             
             // The `/api/density/venueId` logic actually computes the overall Risk score and caches it.
             // We can trigger an update by doing a local mock fetch or moving that logic to a shared service
             // For simplicity, we just rely on clients polling `/api/density` every 30s or on WS messages
        }
    } catch (e) {
        console.error("Cron Fusion Error:", e);
    }
});

// Every 5 minutes: Cleanup old sensor logs to save space
cron.schedule('*/5 * * * *', async () => {
    try {
        const SensorLog = require('./models/SensorLog');
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await SensorLog.deleteMany({ timestamp: { $lt: yesterday } });
    } catch (e) {
        console.error("Cron Cleanup Error:", e);
    }
});

// Port Binding
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
