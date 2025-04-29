import { IProjectController } from "@/src/adapters/controllers/project.controller.interface";
import {
  CreateProjectInput,
  DeleteProjectInput,
  GetProjectsInput,
} from "@/src/adapters/controllers/project.controller.inputSchemas";
import {
  CreateProjectResult,
  GetProjectsResult,
} from "@/src/adapters/controllers/project.controller.interface";
import { Project } from "@/src/business/aggregates/project";

export class ProjectControllerMock implements IProjectController {
  async createProject(input: CreateProjectInput): Promise<CreateProjectResult> {
    console.log("Mock: Creating project", input);

    const project = Project.create({
      name: input.name,
      description: input.description,
      repoLink: input.gitHubRepoUrl,
      owner: input.owner,
    });

    return {
      success: true,
      project,
    };
  }

  async getProjects(input: GetProjectsInput): Promise<GetProjectsResult> {
    console.log("Mock: Getting projects for user", input.userId);

    const project = Project.create({
      name: "Mock Project",
      description: "A mock project description.",
      repoLink: "https://github.com/mock/repo",
      owner: {
        id: input.userId,
        email: "mock@example.com",
        username: "mockuser",
      },
    });

    return {
      success: true,
      projects: [project],
    };
  }

  async deleteProject(input: DeleteProjectInput): Promise<unknown> {
    console.log(
      "Mock: Deleting project",
      input.projectId,
      "for user",
      input.userId
    );

    return { success: true };
  }
}
