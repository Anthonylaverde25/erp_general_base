import { createContext } from 'react';
import { User } from '@auth/user';
import { PartialDeep } from 'type-fest';
import { FuseAuthProviderState } from './types/FuseAuthTypes'; // Verify import
import { FuseAuthProviderType } from './types/FuseAuthTypes'; // Keep this import as it's still used by FuseAuthContextType

export type AuthState = FuseAuthProviderState<User> & {
	provider: string | null;
};

// eslint-disable-next-line react-refresh/only-export-components
export const initialAuthState: AuthState = {
	authStatus: null,
	isAuthenticated: false,
	user: null,
	provider: null
};

export type FuseAuthContextType = {
	updateUser?: (U: PartialDeep<User>, options?: { onlyLocal?: boolean }) => Promise<Response>;
	signOut?: () => void;
	authState: FuseAuthProviderState<User> | null;
	providers: FuseAuthProviderType[];
};

const FuseAuthContext = createContext<FuseAuthContextType>({
	authState: initialAuthState,
	providers: []
});

export default FuseAuthContext;
