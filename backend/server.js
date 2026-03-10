/**
 * Blue Beach Resort — Express Backend
 * ─────────────────────────────────────────────────────────────────────────────
 * • REST API for all resort operations
 * • WebSocket server pushes real-time events to every connected client
 * • Supabase Realtime listeners relay DB changes → WS broadcast
 * • Gemini AI integration server-side (feedback analysis, AI replies)
 */

require('dotenv').config();
const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const path = require('path');
const { supabase } = require('./supabase');
const { broadcast } = require('./ws');

const app = express();
expressWs(app); // attach WebSocket support

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Track WebSocket clients
app.locals.wsClients = new Set();

// ── WebSocket endpoint (/ws) ─────────────────────────────────────────────────
app.ws('/ws', (ws, req) => {
    app.locals.wsClients.add(ws);
    console.log(`[WS] Client connected. Total: ${app.locals.wsClients.size}`);

    // Heartbeat — send ping every 30s to keep alive
    const heartbeat = setInterval(() => {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({ event: 'ping', ts: Date.now() }));
        }
    }, 30000);

    ws.on('message', (msg) => {
        try {
            const parsed = JSON.parse(msg);
            // Client can send 'pong' back
            if (parsed.event === 'pong') return;
            console.log('[WS] Received:', parsed);
        } catch (_) { }
    });

    ws.on('close', () => {
        clearInterval(heartbeat);
        app.locals.wsClients.delete(ws);
        console.log(`[WS] Client disconnected. Total: ${app.locals.wsClients.size}`);
    });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/queries', require('./routes/queries'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/services', require('./routes/services'));
app.use('/api/dining', require('./routes/dining'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/public', require('./routes/public'));

// ── Serve Frontend Build ─────────────────────────────────────────────────────
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        wsClients: app.locals.wsClients.size,
        supabaseUrl: process.env.SUPABASE_URL,
        ts: new Date().toISOString()
    });
});

// ── Supabase Realtime Listeners ──────────────────────────────────────────────
// These listen to DB changes and relay them to all WS clients instantly.
const setupRealtimeListeners = () => {
    console.log('[Realtime] Setting up Supabase channel subscriptions...');

    supabase
        .channel('server-feedback')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, (payload) => {
            console.log('[Realtime] feedback:', payload.eventType);
            broadcast(app, `feedback:${payload.eventType.toLowerCase()}`, payload.new || payload.old);
        })
        .subscribe();

    supabase
        .channel('server-feedback-items')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feedback_items' }, (payload) => {
            broadcast(app, 'feedback_item:new', payload.new);
        })
        .subscribe();

    supabase
        .channel('server-queries')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guest_queries' }, (payload) => {
            console.log('[Realtime] guest_queries:', payload.eventType);
            broadcast(app, `query:${payload.eventType.toLowerCase()}`, payload.new || payload.old);
        })
        .subscribe();

    supabase
        .channel('server-rooms')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, (payload) => {
            console.log('[Realtime] rooms:', payload.eventType);
            broadcast(app, 'room:updated', payload.new || payload.old);
        })
        .subscribe();

    supabase
        .channel('server-tickets')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_tickets' }, (payload) => {
            console.log('[Realtime] maintenance_tickets:', payload.eventType);
            broadcast(app, `ticket:${payload.eventType.toLowerCase()}`, payload.new || payload.old);
        })
        .subscribe();

    supabase
        .channel('server-services')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'butler_requests' }, (payload) => {
            console.log('[Realtime] butler_requests:', payload.eventType);
            broadcast(app, `service:${payload.eventType.toLowerCase()}`, payload.new || payload.old);
        })
        .subscribe();

    supabase
        .channel('server-dining-bookings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'dining_bookings' }, (payload) => {
            console.log('[Realtime] dining_bookings:', payload.eventType);
            broadcast(app, `dining_booking:${payload.eventType.toLowerCase()}`, payload.new || payload.old);
        })
        .subscribe();

    supabase
        .channel('server-inventory')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, (payload) => {
            broadcast(app, `inventory:${payload.eventType.toLowerCase()}`, payload.new || payload.old);
        })
        .subscribe();

    console.log('[Realtime] All channels subscribed ✓');
};

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/ws')) {
        res.sendFile(path.join(distPath, 'index.html'));
    }
});

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`\n🏖️  Blue Beach Resort Full-Stack`);
    console.log(`   REST API  → http://localhost:${PORT}/api`);
    console.log(`   WebSocket → ws://localhost:${PORT}/ws`);
    console.log(`   Web App   → http://localhost:${PORT}`);
    console.log(`   Health    → http://localhost:${PORT}/api/health\n`);
    setupRealtimeListeners();
});
