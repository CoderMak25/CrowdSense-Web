const express = require('express');
const router = express.Router();
const wsManager = require('../services/wsManager');

// GET /api/v1/ws/stats
router.get('/stats', (req, res) => {
    try {
        const stats = wsManager.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/v1/ws/broadcast/test
router.post('/broadcast/test', (req, res) => {
    try {
        const { venueId, event, payload } = req.body;
        
        wsManager.broadcastToVenue(venueId, {
            event: event || 'TEST_BROADCAST',
            venueId,
            ...payload,
            timestamp: new Date().toISOString()
        });

        res.json({ message: "Test broadcast sent manually" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
