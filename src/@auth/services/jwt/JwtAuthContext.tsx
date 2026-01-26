import { FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import { UserTypes } from '@/types/user.types';
import { createContext } from 'react';
import { JwtSignInPayload, JwtSignUpPayload } from '@auth/services/jwt/JwtAuthProvider';

import { ActiveCompany } from '@/types/company.types';

export type JwtAuthContextType = FuseAuthProviderState<UserTypes> & {
	updateUser: (U: UserTypes) => Promise<Response>;
	signIn?: (credentials: JwtSignInPayload) => Promise<{ user: UserTypes; access_token: string, activeCompany: ActiveCompany } | null>;
	signUp?: (U: JwtSignUpPayload) => Promise<{ user: UserTypes; access_token: string } | null>;
	signOut?: () => void;
	refreshToken?: () => Promise<string | Response>;
};

const defaultAuthContext: JwtAuthContextType = {
	authStatus: 'configuring',
	isAuthenticated: false,
	user: null,
	updateUser: null,
	signIn: null,
	signUp: null,
	signOut: null,
	refreshToken: null
};

const JwtAuthContext = createContext<JwtAuthContextType>(defaultAuthContext);

export default JwtAuthContext;
