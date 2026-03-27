const WebSocket = require('ws');

class WSManager {
    constructor() {
        this.wss = null;
        this.rooms = new Map(); // venueId -> Set<ws>
        
        // Singleton pattern
        if (!WSManager.instance) {
            WSManager.instance = this;
        }
        return WSManager.instance;
    }

    initWSServer(httpServer) {
        // Attach to the existing HTTP server on port 5000
        this.wss = new WebSocket.Server({ server: httpServer });

        console.log("[WS] WebSocket Server initialized");

        this.wss.on('connection', (ws, req) => {
            // Setup ping-pong
            ws.isAlive = true;
            ws.on('pong', () => { ws.isAlive = true; });

            // Expecting url pattern: /ws/live/cst-mumbai
            const parts = req.url.split('/');
            const venueId = parts[parts.length - 1];

            if (!req.url.startsWith('/ws/live/') || !venueId) {
                ws.close(1008, 'Invalid connection URL. Expected /ws/live/:venueId');
                return;
            }

            ws.venueId = venueId;

            // Add to room
            if (!this.rooms.has(venueId)) {
                this.rooms.set(venueId, new Set());
            }
            this.rooms.get(venueId).add(ws);

            console.log(`[WS] Client connected to ${venueId} (total: ${this.rooms.get(venueId).size} clients)`);

            // Immediate welcome message
            ws.send(JSON.stringify({
                event: "CONNECTED",
                venueId,
                message: "Live feed active",
                timestamp: new Date().toISOString()
            }));

            // Handle disconnect
            ws.on('close', () => {
                const room = this.rooms.get(venueId);
                if (room) {
                    room.delete(ws);
                    console.log(`[WS] Client disconnected from ${venueId} (remaining: ${room.size} clients)`);
                    if (room.size === 0) {
                        this.rooms.delete(venueId);
                    }
                }
            });
        });

        // Heartbeat ping every 30s
        this.interval = setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (ws.isAlive === false) {
                    return ws.terminate();
                }
                ws.isAlive = false;
                ws.send(JSON.stringify({ event: "PING", timestamp: new Date().toISOString() }));
            });
        }, 30000);

        this.wss.on('close', () => {
            clearInterval(this.interval);
        });
    }

    broadcastToVenue(venueId, payload) {
        const room = this.rooms.get(venueId);
        if (!room) return;

        let sent = 0;
        for (const client of room) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(payload));
                sent++;
            }
        }
        console.log(`[WS] Broadcast to ${venueId}: ${sent} clients | event: ${payload.event}`);
    }

    broadcastToAll(payload) {
        let sent = 0;
        if (!this.wss) return;
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(payload));
                sent++;
            }
        });
        console.log(`[WS] Broadcast to ALL: ${sent} clients | event: ${payload.event}`);
    }

    getStats() {
        let totalClients = 0;
        const venues = {};
        for (const [vId, clients] of this.rooms.entries()) {
            venues[vId] = clients.size;
            totalClients += clients.size;
        }
        return { totalClients, venues };
    }
}

// Export singleton instance
module.exports = new WSManager();
