import type { User, SignUpUser } from "@/src/business/entities/models/user";
import type { ITransaction } from "@/src/business/entities/models/transaction.interface";

export interface IUsersRepository {
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  /**
   * Persisting user in users directory.
   * @param input - user schema for users creation
   * @param tx
   */
  createUser(input: SignUpUser, tx?: ITransaction): Promise<User>;
}
