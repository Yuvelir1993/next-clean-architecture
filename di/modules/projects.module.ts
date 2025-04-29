import { IProjectController } from "@/src/adapters/controllers/project.controller.interface";
import { ProjectController } from "@/src/adapters/controllers/project.controller";
import { ProjectControllerMock } from "@/src/adapters/controllers/project.controller.mock";

import { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";
import { ProjectRepository } from "@/src/infrastructure/repositories/project.repository";
import { ProjectRepositoryMock } from "@/src/infrastructure/repositories/project.repository.mock";

import { IProjectUseCases } from "@/src/business/use-cases/project.use-cases.interface";
import { ProjectUseCases } from "@/src/business/use-cases/project.use-case";

import { DI_SYMBOLS } from "@/di/types";
import { ContainerModule, interfaces } from "inversify";

const initializeProjectsModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IProjectRepository>(DI_SYMBOLS.IProjectRepository).to(
      ProjectRepositoryMock
    );
    bind<IProjectController>(DI_SYMBOLS.IProjectController).to(
      ProjectControllerMock
    );
  } else {
    bind<IProjectController>(DI_SYMBOLS.IProjectController).to(
      ProjectController
    );
    bind<IProjectRepository>(DI_SYMBOLS.IProjectRepository).to(
      ProjectRepository
    );
    bind<IProjectUseCases>(DI_SYMBOLS.IProjectUseCases).to(ProjectUseCases);
  }
};
export const ProjectsModule = new ContainerModule(initializeProjectsModule);
