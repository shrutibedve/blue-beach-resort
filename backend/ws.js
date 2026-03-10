/**
 * WebSocket broadcast utility.
 * All connected frontend clients are stored on `app.locals.wsClients`.
 * Any route can call `broadcast(app, event, data)` to push live updates.
 */

const broadcast = (app, event, data) => {
    const clients = app.locals.wsClients || new Set();
    const payload = JSON.stringify({ event, data, ts: Date.now() });
    clients.forEach(client => {
        try {
            if (client.readyState === 1) { // OPEN
                client.send(payload);
            }
        } catch (err) {
            console.error('[WS] Broadcast error:', err.message);
        }
    });
};

module.exports = { broadcast };
