import { Project } from "@/src/business/aggregates/project";

/**
 * Interface for managing projects in the external database.
 */
export interface IProjectRepository {
  /**
   * Retrieves all projects belonging to a specific user.
   *
   * @param userData - An object containing the user's details.
   * @param userData.userId - The unique identifier of the user whose projects should be retrieved.
   * @returns A promise that resolves to an array of `Project` objects if successful,
   *          or `undefined` if an error occurs.
   * @throws Error if the retrieval operation encounters unexpected issues.
   */
  getProjectsOfUser(userData: {
    userId: string;
  }): Promise<Project[] | undefined>;

  /**
   * Creates a new project for a specific user.
   *
   * @param projectData - An object containing project details.
   * @param projectData.name - The name of the project.
   * @param projectData.description - A brief description of the project (optional).
   * @param projectData.url - The GitHub repository URL associated with the project.
   * @param projectOwner - An object containing the user's details.
   * @param userData.userId - The unique identifier of the user who owns the project.
   * @returns A promise that resolves to the created `Project` instance if successful.
   * @throws Error if project creation fails due to invalid input, insufficient permissions, or system errors.
   */
  createProjectOfUser(
    projectData: { name: string; description: string; url: string },
    projectOwner: { userId: string; userEmail: string; userName: string }
  ): Promise<Project>;

  /**
   * Retrieves all projects belonging to a specific user.
   *
   * @param userData - An object containing the user's details.
   * @param userData.projectId - The unique identifier of the project to be deleted.
   * @param userData.userId - The unique identifier of the user whose project should be deleted.
   * @throws Error if the deletion operation encounters unexpected issues.
   */
  deleteProjectOfUser(input: {
    projectId: string;
    userId: string;
  }): Promise<unknown>;
}
