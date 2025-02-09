import { IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import { ITransaction } from "@/src/business/entities/models/transaction.interface";
import { User, CreateUser } from "@/src/business/entities/models/user";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  // AdminConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AuthenticationError } from "@/src/business/entities/errors/auth";

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
    if (username === "exists") {
      return Promise.resolve({
        id: "12345678910",
        username: username,
        password_hash: "JustAPassword11++",
      });
    }
    return Promise.resolve(undefined);
  }
  async createUser(input: CreateUser, tx?: ITransaction): Promise<User> {
    try {
      console.log(
        `Creating user ${input.username} with input and having transaction ` +
          tx
      );

      const client = new CognitoIdentityProviderClient();
      const command = new AdminCreateUserCommand({
        UserPoolId: "eu-central-1_ASJS74A9U",
        Username: input.username,
        UserAttributes: [
          {
            Name: "name",
            Value: input.username,
          },
        ],
        TemporaryPassword: "HardcodedTempPass34-+",
        MessageAction: "SUPPRESS",
      });
      const response = await client.send(command);

      console.log("AWS Cognito response");
      console.log(response);

      if (!response.User?.Username) {
        throw new AuthenticationError(
          "Username is missing from the AWS Cognito response!"
        );
      }

      // Do not know if necessary
      // const confirm = new AdminConfirmSignUpCommand({
      //   UserPoolId: "eu-central-1_ASJS74A9U",
      //   Username: input.username,
      // });

      return Promise.resolve({
        id: input.id,
        username: response.User.Username,
        password_hash: input.password,
      });
    } catch (error) {
      throw new Error("Error creating user in AWS Cognito!" + error);
    }
  }
}
