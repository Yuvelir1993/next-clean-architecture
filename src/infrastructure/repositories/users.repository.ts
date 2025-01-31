import { IUsersRepository } from "@/src/application/repositories/users.repository.interface";
import { ITransaction } from "@/src/entities/models/transaction.interface";
import { User, CreateUser } from "@/src/entities/models/user";

export class UsersRepository implements IUsersRepository {
  getUser(id: string): Promise<User | undefined> {
    console.log("Getting user with id " + id);
    throw new Error("Method not implemented.");
  }
  getUserByUsername(username: string): Promise<User | undefined> {
    console.log("Getting user with username " + username);
    throw new Error("Method not implemented.");
  }
  createUser(input: CreateUser, tx?: ITransaction): Promise<User> {
    try {
      console.log(
        "Creating user with input " + input + " and having transaction " + tx
      );

      const mockedUser: User = {
        id: input.id,
        username: input.username,
        password_hash: input.password,
      };

      return Promise.resolve(mockedUser);
    } catch (error) {
      throw new Error("Error creating user in AWS Cognito!" + error);
    }
  }
}
