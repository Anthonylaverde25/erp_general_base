/**
 * Singleton module to hold a reference to the POS window opened via window.open().
 * This enables cross-origin communication via postMessage for synchronized logout.
 *
 * The reference is stored at module level so it persists across React re-renders,
 * but is naturally cleared when the ERP page is refreshed or closed.
 */

let posWindowRef: Window | null = null;

/**
 * Store the POS window reference after opening it via window.open().
 * If a previous reference exists but the window was closed, it will be replaced.
 */
export function setPosWindowRef(win: Window | null): void {
	posWindowRef = win;
}

/**
 * Retrieve the current POS window reference.
 * Returns null if the window was never opened or has been closed.
 */
export function getPosWindowRef(): Window | null {
	if (posWindowRef && posWindowRef.closed) {
		posWindowRef = null;
	}
	return posWindowRef;
}

/**
 * Send a postMessage to the POS window if it's open.
 * Used primarily for synchronized logout events.
 *
 * @param message - The message payload to send
 * @param posOrigin - The target origin of the POS window (e.g., 'http://localhost:4000')
 */
export function postMessageToPos(message: unknown, posOrigin: string): void {
	const win = getPosWindowRef();
	if (win) {
		win.postMessage(message, posOrigin);
	}
}
