import { Project } from "@/src/business/domain/aggregates/project";

export interface IProjectUseCases {
  /**
   * Getting existing projects for the user.
   *
   * @param input - An object containing user's id to get it's projects.
   * @returns A Promise resolving to a Project aggregate.
   */
  getProjects(input: { userId: string }): Promise<Project[]>;

  /**
   * Creates a new project with the given details.
   *
   * @param input - The data object required to create a project.
   * @param input.owner - The project's owner unique identity.
   * @param input.name - The name of the project.
   * @param input.description - A brief description of the project.
   * @param input.url - The repository URL associated with the project.
   * @returns A promise that resolves to the created Project instance.
   * @throws Error if the project creation fails due to invalid data or system issues.
   */
  createProject(input: {
    owner: { userId: string; userEmail: string; userName: string };
    name: string;
    description: string;
    url: string;
  }): Promise<Project>;

  /**
   * Deleting existing projects for the user.
   *
   * @param input - An object containing data.
   * @param input.projectId - The project to be deleted.
   * @param input.userId - The owner of the project to be deleted.
   */
  deleteProject(input: { projectId: string; userId: string }): Promise<unknown>;
}
