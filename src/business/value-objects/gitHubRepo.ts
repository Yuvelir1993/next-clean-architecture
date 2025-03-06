import { ProjectCreationError } from "../aggregates/errors/project";


/**
 * Value Object for GitHub repository URL.
 */
export class GitHubRepo {
  private constructor(private readonly url: string) { }

  public static create(url: string): GitHubRepo {
    const regex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;
    if (!regex.test(url)) {
      throw new ProjectCreationError("Invalid GitHub repository URL");
    }
    return new GitHubRepo(url);
  }

  public get value(): string {
    return this.url;
  }
}
