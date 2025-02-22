import { IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import { ITransaction } from "@/src/business/entities/models/transaction.interface";
import { User, SignUpUser } from "@/src/business/entities/models/user";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  ListUsersCommand,
  UserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { AuthenticationError } from "@/src/business/entities/errors/auth";

export class UsersRepository implements IUsersRepository {
  async getUsersByEmail(email: string): Promise<Array<User> | undefined> {
    console.log("Getting user with email " + email);

    const client = new CognitoIdentityProviderClient();

    const comm = new ListUsersCommand({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
      Filter: `email = "${email}"`,
    });

    const { Users } = await client.send(comm);

    if (!Users || Users.length === 0) {
      return undefined;
    }

    const mappedUsers: User[] = Users.map((user: UserType) => ({
      id: user.Username!,
      email:
        user.Attributes?.find((attr) => attr.Name === "email")?.Value || "",
      username:
        user.Attributes?.find((attr) => attr.Name === "name")?.Value || "",
      password: "",
    }));

    return mappedUsers;
  }
  getUserById(id: string): Promise<User | undefined> {
    console.log("Getting user with id " + id);
    throw new Error("Method not implemented.");
  }
  getUserByUsername(username: string): Promise<User | undefined> {
    console.log("Getting user with username " + username);
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
        `Creating user ${userInput.username} with id ${userInput.id} and having transaction ` +
          tx
      );

      const client = new CognitoIdentityProviderClient();

      const comm = new ListUsersCommand({
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
        Filter: `email = "${userInput.email}"`,
      });

      const { Users } = await client.send(comm);

      if (Users && Users.length > 0) {
        throw new AuthenticationError(
          `Email '${userInput.email}' is already in use`
        );
      }

      const command = new AdminCreateUserCommand({
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
        Username: userInput.username,
        UserAttributes: [
          {
            Name: "name",
            Value: userInput.username,
          },
          {
            Name: "email",
            Value: userInput.email,
          },
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
        TemporaryPassword: process.env.AWS_COGNITO_USER_TEMP_PASSWORD!,
        MessageAction: "SUPPRESS",
      });
      const userResponse = await client.send(command);

      console.log("AWS Cognito response");
      console.log(userResponse);

      if (!userResponse.User?.Username) {
        throw new AuthenticationError(
          "Username is missing from the AWS Cognito response!"
        );
      }

      return Promise.resolve({
        id: userInput.id,
        email: userInput.email,
        username: userResponse.User.Username,
        password: userInput.password,
      });
    } catch (error) {
      throw new Error("Error creating user in AWS Cognito!" + error);
    }
  }
}
