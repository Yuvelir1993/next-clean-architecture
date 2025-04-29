import { getInjection } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";
import { describe, it, expect, beforeEach } from "vitest";
import { IProjectController } from "@/src/adapters/controllers/project.controller.interface";
import {
  CreateProjectInput,
  DeleteProjectInput,
  GetProjectsInput,
} from "@/src/adapters/controllers/project.controller.inputSchemas";

let projectController: IProjectController;

beforeEach(() => {
  projectController = getInjection<IProjectController>(
    DI_SYMBOLS.IProjectController
  );
});

describe("ProjectControllerMock", () => {
  it("should successfully create a project", async () => {
    const input: CreateProjectInput = {
      name: "New Test Project",
      description: "Test description",
      gitHubRepoUrl: "https://github.com/test/repo",
      owner: {
        id: "user-id-1",
        email: "test@example.com",
        username: "testuser",
      },
    };

    const result = await projectController.createProject(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.project.name).toBe("New Test Project");
      expect(result.project.githubRepo.value).toBe(
        "https://github.com/test/repo"
      );
      expect(result.project.owner.id).toBe("user-id-1");
    }
  });

  it("should return projects for a given user", async () => {
    const input: GetProjectsInput = {
      userId: "user-id-2",
    };

    const result = await projectController.getProjects(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.projects.length).toBeGreaterThan(0);
      expect(result.projects[0].owner.id).toBe("user-id-2");
    }
  });

  it("should delete a project successfully", async () => {
    const input: DeleteProjectInput = {
      userId: "user-id-3",
      projectId: "project-id-3",
    };

    const result = await projectController.deleteProject(input);
    expect(result).toEqual({ success: true });
  });
});
