import { IUsersRepository } from "@/src/business/interfaces/repositories/users.repository.interface";
import { ITransaction } from "@/src/entities/models/transaction.interface";
import { User, CreateUser } from "@/src/entities/models/user";

export class UsersRepository implements IUsersRepository {
  getUserByEmail(email: string): Promise<User | undefined> {
    console.log("Getting user with email " + email);
    return Promise.resolve({
      id: "12345678910",
      username: "Mock username",
      password_hash: "JustAPassword11++",
    });
  }
  getUserById(id: string): Promise<User | undefined> {
    console.log("Getting user with id " + id);
    throw new Error("Method not implemented.");
  }
  getUserByUsername(username: string): Promise<User | undefined> {
    console.log("Getting user with username " + username);
    return Promise.resolve({
      id: "12345678910",
      username: username,
      password_hash: "JustAPassword11++",
    });
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
