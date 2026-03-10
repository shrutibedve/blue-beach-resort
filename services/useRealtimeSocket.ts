/**
 * useRealtimeSocket — connects to the backend WebSocket server
 * and fires window custom events for each incoming message.
 *
 * Usage:
 *   useRealtimeSocket();  // mount once at App root
 *
 * Then anywhere in the app:
 *   useEffect(() => {
 *     const handler = (e: CustomEvent) => setData(e.detail);
 *     window.addEventListener('feedback:insert', handler);
 *     return () => window.removeEventListener('feedback:insert', handler);
 *   }, []);
 */
import { useEffect, useRef } from 'react';

const WS_URL = import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:4000/ws';

export const useRealtimeSocket = () => {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const connect = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('[WS] Connected to backend');
        };

        ws.onmessage = (e) => {
            try {
                const { event, data } = JSON.parse(e.data);
                if (event === 'ping') {
                    ws.send(JSON.stringify({ event: 'pong' }));
                    return;
                }
                // Dispatch as a window CustomEvent so any component can listen
                window.dispatchEvent(new CustomEvent(event, { detail: data }));
            } catch (err) {
                console.warn('[WS] Could not parse message:', e.data);
            }
        };

        ws.onerror = (err) => {
            console.warn('[WS] Error:', err);
        };

        ws.onclose = () => {
            console.warn('[WS] Disconnected. Reconnecting in 3s...');
            reconnectTimerRef.current = setTimeout(connect, 3000);
        };
    };

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
            wsRef.current?.close();
        };
    }, []);
};

/**
 * useSocketEvent — subscribe to a backend WS event in a component.
 *
 * @param event  e.g. 'feedback:insert', 'room:updated', 'ticket:insert'
 * @param handler callback receiving the event detail payload
 */
export const useSocketEvent = <T = any>(event: string, handler: (data: T) => void) => {
    useEffect(() => {
        const listener = (e: Event) => handler((e as CustomEvent<T>).detail);
        window.addEventListener(event, listener);
        return () => window.removeEventListener(event, listener);
    }, [event, handler]);
};
