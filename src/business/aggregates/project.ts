import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { User, userSchema } from "@/src/business/entities/models/user";
import { GitHubRepo } from "@/src/business/value-objects/gitHubRepo";

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
  public readonly id: string;
  public readonly name: string;
  public readonly owner: User;
  public readonly description?: string;
  public readonly githubRepo: GitHubRepo;
  public version: number;
  public createdAt: Date;
  public updatedAt: Date;

  private constructor(props: {
    id: string;
    name: string;
    owner: User;
    description?: string;
    githubRepo: GitHubRepo;
    version: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.owner = props.owner;
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
      id: uuidv4(),
      name: validatedInput.name,
      owner: validatedInput.owner,
      description: validatedInput.description,
      githubRepo,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Factory method to create an empty/dummy Project.
   */
  public static createEmpty(): Project {
    const now = new Date();
    const dummyUser: User = {
      id: "dummy-id",
      email: "dummy@example.com",
      username: "dummyUser",
      password: "dummyPassword",
    };
    return new Project({
      id: uuidv4(),
      name: "Dummy",
      owner: dummyUser,
      description: "Dummy project description",
      // Use a valid placeholder URL for the GitHub repository.
      githubRepo: GitHubRepo.create(
        "https://github.com/placeholder/placeholder"
      ),
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
  }
}
