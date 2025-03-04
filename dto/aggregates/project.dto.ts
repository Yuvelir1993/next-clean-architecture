import { Project } from "@/src/business/aggregates/project";

export interface ProjectDTO {
  id: string;
  name: string;
  description?: string;
  githubRepoUrl: string;
}

export function mapProjectToDTO(project: Project): ProjectDTO {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    githubRepoUrl: project.githubRepo.value,
  };
}
