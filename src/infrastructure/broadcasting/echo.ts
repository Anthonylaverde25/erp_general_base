import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// @ts-expect-error - Pusher is required as the underlying transport for Laravel Echo + Reverb
window.Pusher = Pusher;

/**
 * Global Laravel Echo instance configured to use Reverb (self-hosted WebSocket server).
 *
 * - Reverb is fully compatible with the Pusher protocol.
 * - authEndpoint points to /api/broadcasting/auth because Broadcast::routes()
 *   is registered inside the api.php route group (under auth:sanctum).
 */
export const echoInstance = new Echo({
	broadcaster: 'reverb',
	key: import.meta.env.VITE_REVERB_APP_KEY || 'yrafeiq0ic0rfdbtlp7l',
	wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
	wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
	wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
	forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
	enabledTransports: ['ws', 'wss'],
	// Broadcast::routes() lives inside routes/api.php → /api/broadcasting/auth
	authEndpoint: `${import.meta.env.VITE_API_BASE_URL_PRIVATE || 'http://127.0.0.1:8000/api'}/broadcasting/auth`,
	auth: {
		headers: {
			Accept: 'application/json'
		}
	}
});

