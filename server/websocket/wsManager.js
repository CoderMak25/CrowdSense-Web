const WebSocket = require('ws');
const { redisPubSub, redisClient } = require('../config/redis');
const { REDIS_KEYS } = require('../config/constants');

// Memory map of rooms: venueId -> Set of WS clients
const rooms = new Map();

/**
 * Attaches WebSocket server to HTTP server and handles live data streams
 * @param {http.Server} server 
 */
const initWebSocket = (server) => {
    const wss = new WebSocket.Server({ server, path: '/ws' });

    console.log("WebSocket Server initialized at /ws");

    wss.on('connection', async (ws, req) => {
        try {
            // Very simple routing: /ws/live/:venueId
            const urlParts = req.url.split('?')[0].split('/');
            const venueId = urlParts[urlParts.length - 1];

            if (!venueId || venueId === 'ws') {
                ws.close(1008, 'Venue ID required');
                return;
            }

            console.log(`New WS connection for venue: ${venueId}`);

            // Add client to room
            if (!rooms.has(venueId)) {
                rooms.set(venueId, new Set());
                
                // Subscribe to redis channel for this venue only once per room
                redisPubSub.subscribe(REDIS_KEYS.LIVE_ROOM(venueId), (err) => {
                    if (err) console.error(`Failed to subscribe to ${venueId}`, err);
                });
            }
            
            rooms.get(venueId).add(ws);
            ws.venueRoom = venueId;

            // Immediately send current cached state if exists
            const cached = await redisClient.get(REDIS_KEYS.DENSITY_CACHE(venueId));
            if (cached) {
                 ws.send(JSON.stringify({ type: 'CROWD_UPDATE', payload: JSON.parse(cached) }));
            }

            // Client settings
            ws.isAlive = true;
            ws.on('pong', () => { ws.isAlive = true; });

            ws.on('close', () => {
                const room = rooms.get(ws.venueRoom);
                if (room) {
                    room.delete(ws);
                    if (room.size === 0) {
                        // Cleanup
                        redisPubSub.unsubscribe(REDIS_KEYS.LIVE_ROOM(ws.venueRoom));
                        rooms.delete(ws.venueRoom);
                    }
                }
            });

        } catch (error) {
            console.error("WS Connection error:", error);
            ws.close(1011, 'Internal routing error');
        }
    });

    // Handle incoming broadcast messages from Redis
    redisPubSub.on('message', (channel, message) => {
        // Find venueId from channel
        const prefix = 'crowdsense:live:';
        if (!channel.startsWith(prefix)) return;
        
        const venueId = channel.slice(prefix.length);
        const room = rooms.get(venueId);
        
        if (room) {
            // Broadcast to all clients in room
            for (const client of room) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            }
        }
    });

    // Heartbeat ping every 30s
    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on('close', () => clearInterval(interval));
    
    return wss;
};

// Also export a manual broadcast method (used by cron jobs directly)
const broadcastToVenue = (venueId, type, payload) => {
    redisPubSub.publish(REDIS_KEYS.LIVE_ROOM(venueId), JSON.stringify({ type, payload }));
};

module.exports = { initWebSocket, broadcastToVenue };
