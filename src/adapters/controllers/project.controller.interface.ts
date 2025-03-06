import { Project } from "@/src/business/aggregates/project";
import { User } from "@/src/business/entities/models/user";

/**
 * Interface for the Project Controller.
 *
 */
export interface IProjectController {
  /**
   * Retrieves a list of projects for the given user.
   *
   * @param user - The user for whom projects should be retrieved.
   * @returns A promise that resolves to an array of Project objects.
   */
  getProjects(userId: Pick<User, "id">): Promise<Project[]>;
}
