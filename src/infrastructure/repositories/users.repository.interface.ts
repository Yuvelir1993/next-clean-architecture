import type { User, SignUpUser } from "@/src/business/domain/entities/user";
import type { ITransaction } from "@/src/business/domain/entities/transaction.interface";

export interface IUsersRepository {
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByEmail(email: string): Promise<Array<User> | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  /**
   * Persisting user in users directory.
   * @param input - user schema for users creation
   * @param tx
   */
  createUser(
    input: Pick<SignUpUser, "email" | "username" | "password">,
    tx?: ITransaction
  ): Promise<User>;
}
