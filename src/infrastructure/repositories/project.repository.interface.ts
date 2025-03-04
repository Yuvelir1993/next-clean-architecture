import { Project } from "@/src/business/aggregates/project";

/**
 * Interface for getting projects functionality from the external databases.
 */
export interface IProjectRepository {
  /**
   * Getting all projects belonging to this user.
   * @param userId - user id which owns projects to be retrieved.
   * @returns list of projects or 'undefined' in case of any error.
   */
  getProjectsOfUser(userId: string): Promise<Project[] | undefined>;
}
