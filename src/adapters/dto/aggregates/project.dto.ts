import { Project } from "@/src/business/aggregates/project";

export interface ProjectUiDTO {
  id: string;
  name: string;
  description?: string;
  githubRepoUrl: string;
}

export function mapProjectToUiDTO(project: Project): ProjectUiDTO {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    githubRepoUrl: project.githubRepo.value,
  };
}
