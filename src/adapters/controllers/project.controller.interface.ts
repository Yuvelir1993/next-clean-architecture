import { Project } from "@/src/business/domain/aggregates/project";

import {
  CreateProjectInput,
  DeleteProjectInput,
  GetProjectsInput,
} from "@/src/adapters/controllers/project.controller.inputSchemas";

export type GetProjectsResult =
  | { success: true; projects: Project[] }
  | { success: false; errors: string[] };

export type CreateProjectResult =
  | { success: true; project: Project }
  | { success: false; errors: string[] };

/**
 * Interface for the Project Controller.
 *
 */
export interface IProjectController {
  /**
   * Retrieves a list of projects for the given user.
   *
   * @param userId - The user for whom projects should be retrieved.
   * @returns A promise that resolves to a GetProjectsResult, indicating success with an array of Project objects,
   * or failure with an array of error messages.
   */
  getProjects(input: GetProjectsInput): Promise<GetProjectsResult>;

  /**
   * Creates a new project.
   *
   * @param input - Partial input based on the createProjectInputSchema.
   * @returns A promise that resolves to a CreateProjectResult, indicating success with the created project,
   * or failure with an array of error messages.
   */
  createProject(input: CreateProjectInput): Promise<CreateProjectResult>;

  /**
   * Deletes a project for the given user.
   *
   * @param userId - The user for whom projects should be retrieved.
   * @param projectId - The project to be deleted.
   */
  deleteProject(input: DeleteProjectInput): unknown;
}
