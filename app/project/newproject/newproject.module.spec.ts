import { NewprojectModule } from './newproject.module';

describe('NewprojectModule', () => {
  let newprojectModule: NewprojectModule;

  beforeEach(() => {
    newprojectModule = new NewprojectModule();
  });

  it('should create an instance', () => {
    expect(newprojectModule).toBeTruthy();
  });
});
