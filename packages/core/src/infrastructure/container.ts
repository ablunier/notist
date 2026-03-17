import { createContainer, asFunction, type AwilixContainer } from "awilix";
import { SdkProjectTodoistGateway, SdkTodoistLabelGateway, SdkTodoistSectionGateway } from "./SdkTodoistGateway.js";
import type { LabelTodoistGateway, ProjectTodoistGateway, SectionTodoistGateway } from "../domain/TodoistGateway.js";
import type { ProjectRepository } from "../domain/ProjectRepository.js";
import { FileSystemProjectRepository } from "./FileSystemProjectRepository.js";

type Cradle = {
    ProjectTodoistGateway: ProjectTodoistGateway;
    SectionTodoistGateway: SectionTodoistGateway;
    LabelTodoistGateway: LabelTodoistGateway;
    ProjectRepository: ProjectRepository;
};

export type AppContainer = AwilixContainer<Cradle>;

export function buildContainer(): AppContainer {
    const container = createContainer<Cradle>();

    container.register({
        ProjectTodoistGateway: asFunction(
            () => new SdkProjectTodoistGateway(process.env.TODOIST_KEY as string)
        ),
        SectionTodoistGateway: asFunction(
            () => new SdkTodoistSectionGateway(process.env.TODOIST_KEY as string)
        ),
        LabelTodoistGateway: asFunction(
            () => new SdkTodoistLabelGateway(process.env.TODOIST_KEY as string)
        ),
        ProjectRepository: asFunction(() => new FileSystemProjectRepository("data/projects.json"))
    });

    return container;
}
