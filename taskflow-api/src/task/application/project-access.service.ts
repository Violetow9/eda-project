import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectAccessService {
  canAccessProject(_input: {
    userId: string;
    projectId: number;
  }): Promise<boolean> {
    return Promise.resolve(true);
  }
}
