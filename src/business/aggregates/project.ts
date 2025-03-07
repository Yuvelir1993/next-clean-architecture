import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { User, userSchema } from "../entities/models/user";
import { ProjectCreationError } from "./errors/project";

/**
 * Value Object for GitHub repository URL.
 */
class GitHubRepo {
  private constructor(private readonly url: string) {}

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

/**
 * Zod schema for raw project input.
 * This validates the data at the application boundary.
 */
const projectInputSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  description: z.string().optional(),
  repoLink: z.string().url(),
  owner: userSchema, // including the full User entity
});
type ProjectInput = z.infer<typeof projectInputSchema>;

/**
 * Project Aggregate.
 * This is the root of the Project domain and enforces invariants
 * by using value objects and its own methods.
 */
export class Project {
  public readonly projectId: string;
  public readonly owner: User;
  public readonly name: string;
  public readonly description?: string;
  public readonly githubRepo: GitHubRepo;
  public version: number;
  public createdAt: Date;
  public updatedAt: Date;

  private constructor(props: {
    projectId: string;
    owner: User;
    name: string;
    description?: string;
    githubRepo: GitHubRepo;
    version: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.projectId = props.projectId;
    this.owner = props.owner;
    this.name = props.name;
    this.description = props.description;
    this.githubRepo = props.githubRepo;
    this.version = props.version;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Factory method to create a new Project aggregate.
   * It uses Zod to validate the incoming data and then
   * constructs the aggregate by creating the necessary value objects.
   */
  public static create(input: ProjectInput): Project {
    const validatedInput = projectInputSchema.parse(input);
    const githubRepo = GitHubRepo.create(validatedInput.repoLink);
    const now = new Date();

    return new Project({
      projectId: uuidv4(),
      owner: validatedInput.owner,
      name: validatedInput.name,
      description: validatedInput.description,
      githubRepo,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
  }
}
