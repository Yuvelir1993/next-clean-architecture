import { Project } from "@/src/business/aggregates/project";

export interface IProjectUseCases {
  /**
   * Getting existing projects for the user.
   *
   * @param input - An object containing user's id to get it's projects.
   * @returns A Promise resolving to a Project aggregate.
   */
  getProjects(input: { userId: string }): Promise<Project[]>;
}
