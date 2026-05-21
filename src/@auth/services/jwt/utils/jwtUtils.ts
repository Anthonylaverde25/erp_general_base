import jwtDecode, { JwtPayload } from 'jwt-decode';

const isSanctumToken = (accessToken: string): boolean => accessToken.includes('|');

export const isTokenValid = (accessToken: string | null): boolean => {
	if (!accessToken || typeof accessToken !== 'string' || accessToken.trim() === '') {
		return false;
	}

	// Laravel Sanctum plain-text tokens are validated server-side on session restore.
	if (isSanctumToken(accessToken)) {
		return true;
	}

	try {
		const decoded = jwtDecode<JwtPayload>(accessToken);
		const currentTime = Date.now() / 1000;
		return decoded.exp > currentTime;
	} catch (error) {
		console.error(error);
		return false;
	}
};
