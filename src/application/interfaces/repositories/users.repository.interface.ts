import type { User, CreateUser } from "@/src/entities/models/user";
import type { ITransaction } from "@/src/entities/models/transaction.interface";

export interface IUsersRepository {
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(input: CreateUser, tx?: ITransaction): Promise<User>;
}
