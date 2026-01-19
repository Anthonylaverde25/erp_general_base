import { User } from "../User";

export interface IUserCrudRepository {
  index(): Promise<User[]>
}