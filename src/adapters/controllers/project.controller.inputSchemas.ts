import { z } from "zod";

export const createProjectInputSchema = z.object({
  name: z.string().min(1, { message: "Project name is required." }),
  description: z.string().optional(),
  owner: z.string().min(1, { message: "Project owner is required." }),
  gitHubRepoUrl: z
    .string()
    .url("Invalid GitHub URL format.")
    .regex(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/, {
      message: "Invalid GitHub repository URL format.",
    }),
});
export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const getProjectsInputSchema = z.object({
  userId: z.string().min(1, { message: "User id is required." }),
});

export type GetProjectsInput = z.infer<typeof getProjectsInputSchema>;
