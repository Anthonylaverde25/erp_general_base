import { useState, useEffect, useCallback, useMemo, useImperativeHandle } from 'react';
import { FuseAuthProviderComponentProps, FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import useLocalStorage from '@fuse/hooks/useLocalStorage';
import { authRefreshToken, authSignIn, authSignInWithToken, authSignUp, authUpdateDbUser, authLogout } from '@auth/authApi';
import { User } from '../../user';
import { removeGlobalHeaders, setGlobalHeaders } from '@/utils/api';
import { isTokenValid } from './utils/jwtUtils';
import JwtAuthContext from '@auth/services/jwt/JwtAuthContext';
import { JwtAuthContextType } from '@auth/services/jwt/JwtAuthContext';
import { HTTPError } from 'ky';
import { IUser } from '@/types/user.types';
import { postMessageToPos } from '@/utils/posWindowRef';

export type JwtSignInPayload = {
	email: string;
	password: string;
};

export type JwtSignUpPayload = {
	displayName: string;
	email: string;
	password: string;
};

function JwtAuthProvider(props: FuseAuthProviderComponentProps) {
	const { ref, children, onAuthStateChanged } = props;

	const {
		value: tokenStorageValue,
		setValue: setTokenStorageValue,
		removeValue: removeTokenStorageValue
	} = useLocalStorage<string>('jwt_access_token');

	/**
	 * Fuse Auth Provider State
	 */
	const [authState, setAuthState] = useState<FuseAuthProviderState<IUser>>({
		authStatus: 'configuring',
		isAuthenticated: false,
		user: null
	});

	/**
	 * Watch for changes in the auth state
	 * and pass them to the FuseAuthProvider
	 */
	useEffect(() => {
		if (onAuthStateChanged) {
			onAuthStateChanged(authState as any);
		}
	}, [authState, onAuthStateChanged]);

	/**
	 * Attempt to auto login with the stored token
	 */
	useEffect(() => {
		const attemptAutoLogin = async () => {
			const accessToken = tokenStorageValue;

			if (isTokenValid(accessToken)) {
				try {
					const userDataRaw = await authSignInWithToken(accessToken);
					const userData = { ...userDataRaw, role: userDataRaw.role?.code } as unknown as IUser;
					setGlobalHeaders({ Authorization: `Bearer ${accessToken}` });
					return userData;
				} catch (error) {
					if (error instanceof HTTPError) {
						console.error('Auto login failed:', error.response.status);
					} else {
						console.error('Auto login failed:', error);
					}

					return false;
				}
			}

			return false;
		};

		if (!authState.isAuthenticated) {
			attemptAutoLogin().then((userData) => {
				if (userData) {
					setAuthState({
						authStatus: 'authenticated',
						isAuthenticated: true,
						user: userData
					});
				} else {
					removeTokenStorageValue();
					removeGlobalHeaders(['Authorization']);
					setAuthState({
						authStatus: 'unauthenticated',
						isAuthenticated: false,
						user: null
					});
				}
			});
		}
		// eslint-disable-next-line
	}, [authState.isAuthenticated]);

	/**
	 * Sign in
	 */
	const signIn: JwtAuthContextType['signIn'] = useCallback(
		async (credentials) => {
			try {
				const { user, access_token } = await authSignIn(credentials);

				setAuthState({
					authStatus: 'authenticated',
					isAuthenticated: true,
					user: { ...user, role: user.role?.code } as unknown as IUser
				});

				setTokenStorageValue(access_token);
				setGlobalHeaders({ Authorization: `Bearer ${access_token}` });

				return { user, access_token };
			} catch (error) {
				if (error instanceof HTTPError) {
					console.error('Sign in failed:', error.response.status);
				}

				throw error;
			}
		},
		[setTokenStorageValue]
	);

	/**
	 * Sign up
	 */
	const signUp: JwtAuthContextType['signUp'] = useCallback(
		async (data) => {
			try {
				const session = await authSignUp(data);
				setAuthState({
					authStatus: 'authenticated',
					isAuthenticated: true,
					user: session.user
				});
				setTokenStorageValue(session.access_token);
				setGlobalHeaders({ Authorization: `Bearer ${session.access_token}` });
				return session;
			} catch (error) {
				if (error instanceof HTTPError) {
					console.error('Sign up failed:', error.response.status);
				}

				throw error;
			}
		},
		[setTokenStorageValue]
	);

	/**
	 * Sign out
	 */
	const signOut: JwtAuthContextType['signOut'] = useCallback(async () => {
		try {
			// Notify the POS window via cross-origin postMessage before invalidating the token
			const posOrigin = window.location.hostname === 'localhost'
				? 'http://localhost:4000'
				: `https://pos.${window.location.hostname.replace('app.', '')}`;
			postMessageToPos({ type: 'LOGOUT_EVENT', source: 'ERP' }, posOrigin);

			await authLogout();
		} catch (error) {
			console.error('Logout failed:', error);
		} finally {
			removeTokenStorageValue();
			removeGlobalHeaders(['Authorization']);
			setAuthState({
				authStatus: 'unauthenticated',
				isAuthenticated: false,
				user: null
			});
		}
	}, [removeTokenStorageValue]);

	/**
	 * Update user
	 */
	const updateUser: JwtAuthContextType['updateUser'] = useCallback(
		async (_user, options) => {
			try {
				let response: Response;

				if (!options?.onlyLocal) {
					// Merge current user with updates to ensure ID is present for the API call
					const userToUpdate = { ...authState.user, ..._user } as unknown as User;
					response = await authUpdateDbUser(userToUpdate);
				} else {
					response = new Response(JSON.stringify({ message: 'Local update success' }), { status: 200 });
				}

				setAuthState((prev) => ({
					...prev,
					user: {
						...prev.user,
						..._user
					} as IUser
				}));

				return response;
			} catch (error) {
				if (error instanceof HTTPError) {
					console.error('Update user failed:', error.response.status);
				}

				throw error;
			}
		},
		[authState.user]
	);

	/**
	 * Refresh access token
	 */
	const refreshToken: JwtAuthContextType['refreshToken'] = useCallback(async () => {
		try {
			const response = await authRefreshToken();
			return response;
		} catch (error) {
			if (error instanceof HTTPError) {
				console.error('Token refresh failed:', error.response.status);
			}

			throw error;
		}
	}, []);

	/**
	 * Auth Context Value
	 */
	const authContextValue = useMemo(
		() =>
			({
				...authState,
				signIn,
				signUp,
				signOut,
				updateUser,
				refreshToken
			}) as JwtAuthContextType,
		[authState, signIn, signUp, signOut, updateUser, refreshToken]
	);

	/**
	 * Expose methods to the FuseAuthProvider
	 */
	useImperativeHandle(ref, () => ({
		signOut,
		updateUser
	}));

	/**
	 * Intercept fetch requests to refresh the access token
	 */
	const interceptFetch = useCallback(() => {
		const { fetch: originalFetch } = window;

		window.fetch = async (...args) => {
			const [resource, config] = args;
			try {
				const response = await originalFetch(resource, config);
				const newAccessToken = response.headers.get('New-Access-Token');

				if (newAccessToken) {
					setGlobalHeaders({ Authorization: `Bearer ${newAccessToken}` });
					setTokenStorageValue(newAccessToken);
				}

				if (response.status === 401) {
					signOut();
					console.error('Unauthorized request. User was signed out.');
				}

				return response;
			} catch (error) {
				if (error instanceof HTTPError && error.response.status === 401) {
					signOut();
					console.error('Unauthorized request. User was signed out.');
				}

				throw error;
			}
		};
	}, [setTokenStorageValue, signOut]);

	useEffect(() => {
		if (authState.isAuthenticated) {
			interceptFetch();
		}
	}, [authState.isAuthenticated, interceptFetch]);

	return <JwtAuthContext value={authContextValue}>{children}</JwtAuthContext>;
}

export default JwtAuthProvider;
