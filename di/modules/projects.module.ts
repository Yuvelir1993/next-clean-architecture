import { IProjectController } from "@/src/adapters/controllers/project.controller.interface";
import { ProjectController } from "@/src/adapters/controllers/project.controller";

import { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";
import { ProjectRepository } from "@/src/infrastructure/repositories/project.repository";

import { DI_SYMBOLS } from "@/di/types";
import { ContainerModule, interfaces } from "inversify";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IProjectController>(DI_SYMBOLS.IProjectController).to(ProjectController);
  bind<IProjectRepository>(DI_SYMBOLS.IProjectRepository).to(ProjectRepository);
};
export const ProjectsModule = new ContainerModule(initializeModule);
