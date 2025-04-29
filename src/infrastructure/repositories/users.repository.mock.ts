import { IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import { ITransaction } from "@/src/business/entities/models/transaction.interface";
import { User, SignUpUser } from "@/src/business/entities/models/user";
import { AuthenticationError } from "@/src/business/errors";

export class UsersRepositoryMock implements IUsersRepository {
  private users: User[] = [
    {
      id: "1",
      email: "test1@example.com",
      username: "testuser1",
      password: "Password123!",
    },
    {
      id: "2",
      email: "test2@example.com",
      username: "testuser2",
      password: "Password456!",
    },
  ];

  async getUsersByEmail(email: string): Promise<Array<User> | undefined> {
    console.log("[mock] Getting user(s) with email " + email);
    const matchedUsers = this.users.filter((user) => user.email === email);

    if (matchedUsers.length === 0) {
      return undefined;
    }

    return matchedUsers;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log("[mock] Getting user with email " + email);
    const users: Array<User> | undefined = await this.getUsersByEmail(email);

    if (users && users.length > 1) {
      throw new AuthenticationError(
        `More than one user registered with the provided email '${email}'! Please contact your administrator!`
      );
    }

    if (!users || users.length === 0) {
      console.error(`No user found with email '${email}'`);
      return undefined;
    }

    return users[0];
  }

  getUserById(id: string): Promise<User | undefined> {
    console.log("[mock] Getting user with id " + id);
    throw new Error("Method not implemented.");
  }

  getUserByUsername(username: string): Promise<User | undefined> {
    console.log("[mock] Getting user with username " + username);
    if (username === "exists") {
      return Promise.resolve({
        id: "12345678910",
        username: username,
        email: "email@gmail.com",
        password: "JustAPassword11++",
      });
    }
    return Promise.resolve(undefined);
  }

  async createUser(userInput: SignUpUser, tx?: ITransaction): Promise<User> {
    try {
      console.log(
        `[mock] Creating user ${userInput.username} with transaction ` + tx
      );

      const userId = (this.users.length + 1).toString();

      const newUser: User = {
        id: userId,
        email: userInput.email,
        username: userInput.username,
        password: userInput.password,
      };

      this.users.push(newUser);

      return Promise.resolve(newUser);
    } catch (error) {
      throw new Error("Error creating user in mock repository! " + error);
    }
  }
}
