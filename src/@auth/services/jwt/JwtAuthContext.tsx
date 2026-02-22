import { FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import { IUser } from '@/types/user.types';
import { createContext } from 'react';
import { JwtSignInPayload, JwtSignUpPayload } from '@auth/services/jwt/JwtAuthProvider';

import { PartialDeep } from 'type-fest';

export type JwtAuthContextType = FuseAuthProviderState<IUser> & {
	updateUser: (U: PartialDeep<IUser>, options?: { onlyLocal?: boolean }) => Promise<Response>;
	signIn?: (credentials: JwtSignInPayload) => Promise<{ user: IUser; access_token: string } | null>;
	signUp?: (U: JwtSignUpPayload) => Promise<{ user: IUser; access_token: string } | null>;
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
