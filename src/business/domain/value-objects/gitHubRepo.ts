/**
 * Value Object for GitHub repository URL.
 */
export class GitHubRepoURL {
  private constructor(private readonly url: string) {}

  public static create(url: string): GitHubRepoURL {
    const regex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;
    if (!regex.test(url)) {
      throw new GitHubRepoURLError("Invalid GitHub repository URL");
    }
    return new GitHubRepoURL(url);
  }

  public get value(): string {
    return this.url;
  }
}

export class GitHubRepoURLError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
