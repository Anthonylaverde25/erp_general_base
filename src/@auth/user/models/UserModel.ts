import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { User } from '@auth/user';

/**
 * Creates a new user object with the specified data.
 */
function UserModel(data?: PartialDeep<User>): User {
	data = data || {};

	return _.defaults(data, {
		id: `user-${_.random(0, 1000)}`, // Default ID logic from original template likely, but we can keep what we had or revert. Original diff showed "role: null, displayName: null..."
		role: null, // guest
		displayName: 'Guest',
		photoURL: '',
		email: '',
		shortcuts: [],
		settings: {},
		loginRedirectUrl: '/'
	}) as User;
}

export default UserModel;
