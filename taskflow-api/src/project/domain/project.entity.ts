interface ProjectConstructorParams {
  id: number;
  projectName: string;
}

export class Project {
  readonly id: number;
  readonly projectName: string;

  constructor({ id, projectName }: ProjectConstructorParams) {
    this.id = id;
    this.projectName = projectName;
  }
}
