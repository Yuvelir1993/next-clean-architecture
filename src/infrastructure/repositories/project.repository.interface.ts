import { Project } from "@/src/business/aggregates/project";
import { ProjectInfraDTO } from "@/src/infrastructure/dto/project.dto";

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

  /**
   * Creating a project.
   * @param project - project DTO which keeps project-related data necessary for it's creation
   */
  createProjectOfUser(userId: string, project: ProjectInfraDTO): Promise<boolean>;
}
