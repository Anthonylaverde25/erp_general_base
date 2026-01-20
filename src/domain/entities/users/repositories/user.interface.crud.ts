import { User } from '../User';

export interface IUserCrudRepository {
	index(): Promise<User[]>;
	create(data: User): Promise<{ user: User; message: string }>;
	update(id: number, data: User): Promise<{ user: User; message: string }>;
}
