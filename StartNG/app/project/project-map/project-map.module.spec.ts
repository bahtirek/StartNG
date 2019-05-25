import { ProjectMapModule } from './project-map.module';

describe('ProjectMapModule', () => {
  let projectMapModule: ProjectMapModule;

  beforeEach(() => {
    projectMapModule = new ProjectMapModule();
  });

  it('should create an instance', () => {
    expect(projectMapModule).toBeTruthy();
  });
});
