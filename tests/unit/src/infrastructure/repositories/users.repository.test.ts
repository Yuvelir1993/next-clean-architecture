import { getInjection } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";

import { describe, it, expect, beforeEach } from "vitest";
import { IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";

let usersRepo: IUsersRepository;

beforeEach(() => {
  usersRepo = getInjection<IUsersRepository>(DI_SYMBOLS.IUsersRepository);
});

describe("UsersRepositoryMock", () => {
  describe("getUsersByEmail", () => {
    it("should return a user by email", async () => {
      const users = await usersRepo.getUsersByEmail("test1@example.com");
      expect(users).toBeDefined();
      expect(users![0].username).toBe("testuser1");
    });

    it("should return undefined if no user matches email", async () => {
      const users = await usersRepo.getUsersByEmail("nonexistent@example.com");
      expect(users).toBeUndefined();
    });
  });

  describe("getUserByEmail", () => {
    it("should return a single user by email", async () => {
      const user = await usersRepo.getUserByEmail("test1@example.com");
      expect(user).toBeDefined();
      expect(user!.username).toBe("testuser1");
    });

    it("should return undefined if no user is found", async () => {
      const user = await usersRepo.getUserByEmail("unknown@example.com");
      expect(user).toBeUndefined();
    });
  });

  describe("getUserByUsername", () => {
    it("should return user if username is 'exists'", async () => {
      const user = await usersRepo.getUserByUsername("exists");
      expect(user).toBeDefined();
      expect(user!.email).toBe("email@gmail.com");
    });

    it("should return undefined if username does not exist", async () => {
      const user = await usersRepo.getUserByUsername("unknown");
      expect(user).toBeUndefined();
    });
  });

  describe("createUser", () => {
    it("should create and return a new user", async () => {
      const newUserInput = {
        id: "any-id", // id will be overridden
        email: "newuser@example.com",
        username: "newuser",
        password: "StrongPass123!",
        type: "signup" as const,
      };

      const newUser = await usersRepo.createUser(newUserInput);

      expect(newUser).toBeDefined();
      expect(newUser.email).toBe("newuser@example.com");
      expect(newUser.username).toBe("newuser");
      // Also check that it is added to the internal list
      const fetched = await usersRepo.getUserByEmail("newuser@example.com");
      expect(fetched).toBeDefined();
    });
  });
});
