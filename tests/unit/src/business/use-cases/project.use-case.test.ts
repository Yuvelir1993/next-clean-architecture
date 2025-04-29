import { getInjection } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";
import { describe, it, expect, beforeEach } from "vitest";
import { IProjectUseCases } from "@/src/business/use-cases/project.use-cases.interface";
import { Project } from "@/src/business/aggregates/project";

let projectUseCases: IProjectUseCases;

beforeEach(() => {
  projectUseCases = getInjection<IProjectUseCases>(DI_SYMBOLS.IProjectUseCases);
});

describe("ProjectUseCases", () => {
  it("should fetch an array of Project instances for a given user", async () => {
    const userId = "test-user-id";
    const projects = await projectUseCases.getProjects({ userId });

    expect(Array.isArray(projects)).toBe(true);
    // Each item should be a Project aggregate
    projects.forEach((project) => {
      expect(project).toBeInstanceOf(Project);
      expect(project.owner.id).toBe(userId);
    });
  });

  it("should create a new Project with provided input", async () => {
    const input = {
      owner: {
        userId: "creator-id",
        userEmail: "creator@example.com",
        userName: "creatorUser",
      },
      name: "New Project",
      description: "A test project.",
      url: "https://github.com/org/repo",
    };

    const project = await projectUseCases.createProject(input);

    expect(project).toBeInstanceOf(Project);
    expect(project.name).toBe(input.name);
    expect(project.description).toBe(input.description);
    expect(project.githubRepo.value).toBe(input.url);
    expect(project.owner.id).toBe(input.owner.userId);
    expect(project.owner.email).toBe(input.owner.userEmail);
    expect(project.owner.username).toBe(input.owner.userName);
  });
});
