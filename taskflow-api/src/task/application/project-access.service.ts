import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectAccessService {
  async canAccessProject(input: {
    userId: string;
    projectId: number;
  }): Promise<boolean> {
    return true;
  }
}