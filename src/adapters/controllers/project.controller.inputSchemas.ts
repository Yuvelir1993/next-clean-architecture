import { projectOwnerSchema } from "@/src/business/domain/entities/models/user";
import { z } from "zod";

export const createProjectInputSchema = z.object({
  name: z.string().min(1, { message: "Project name is required." }),
  description: z.string(),
  owner: projectOwnerSchema,
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

export const deleteProjectInputSchema = z.object({
  userId: z.string().min(1, { message: "User id is required." }),
  projectId: z.string().min(1, { message: "Project id is required." }),
});

export type DeleteProjectInput = z.infer<typeof deleteProjectInputSchema>;
