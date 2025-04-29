import { getInjection } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";

import { describe, it, expect, beforeEach } from "vitest";
import { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";

let projectsRepo: IProjectRepository;

beforeEach(() => {
  projectsRepo = getInjection<IProjectRepository>(
    DI_SYMBOLS.IProjectRepository
  );
});

describe("ProjectRepositoryMock", () => {
  it("should create a project for a user", async () => {
    const project = await projectsRepo.createProjectOfUser(
      {
        name: "Test Project",
        description: "A simple test project",
        url: "https://github.com/test/project",
      },
      {
        userId: "user-1",
        userEmail: "user@example.com",
        userName: "testuser",
      }
    );

    expect(project).toBeDefined();
    expect(project.name).toBe("Test Project");
    expect(project.owner.id).toBe("user-1");
  });

  it("should retrieve projects for a user", async () => {
    await projectsRepo.createProjectOfUser(
      {
        name: "Project One",
        description: "First project",
        url: "https://github.com/test/project-one",
      },
      {
        userId: "user-2",
        userEmail: "user2@example.com",
        userName: "user2",
      }
    );

    const projects = await projectsRepo.getProjectsOfUser({ userId: "user-2" });

    expect(projects).toBeDefined();
    expect(projects!.length).toBe(1);
    expect(projects![0].name).toBe("Project One");
  });

  it("should return empty array if no projects for a user", async () => {
    const projects = await projectsRepo.getProjectsOfUser({
      userId: "unknown-user",
    });
    expect(projects).toBeDefined();
    expect(projects!.length).toBe(0);
  });

  it("should delete a project for a user", async () => {
    const project = await projectsRepo.createProjectOfUser(
      {
        name: "Project To Delete",
        description: "Will be deleted",
        url: "https://github.com/test/delete-project",
      },
      {
        userId: "user-3",
        userEmail: "user3@example.com",
        userName: "user3",
      }
    );

    const result = await projectsRepo.deleteProjectOfUser({
      projectId: project.id,
      userId: "user-3",
    });

    expect(result).toEqual({ success: true });

    const projectsAfterDeletion = await projectsRepo.getProjectsOfUser({
      userId: "user-3",
    });
    expect(projectsAfterDeletion).toBeDefined();
    expect(projectsAfterDeletion!.length).toBe(0);
  });

  it("should throw an error if trying to delete non-existing project", async () => {
    await expect(
      projectsRepo.deleteProjectOfUser({
        projectId: "nonexistent-id",
        userId: "nonexistent-user",
      })
    ).rejects.toThrowError(
      'Project "nonexistent-id" not found for user "nonexistent-user".'
    );
  });
});
