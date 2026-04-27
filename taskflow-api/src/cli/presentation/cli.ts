import { NestFactory } from '@nestjs/core';
import { CliModule } from '../cli.module';
import { AdminCliCommand } from './admin-cli.command';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliModule, {
    logger: ['error', 'warn', 'log'],
  });

  const cli = app.get(AdminCliCommand);
  const [, , command, ...args] = process.argv;

  try {
    switch (command) {
      case 'create-project': {
        const [projectName] = args;

        if (!projectName) {
          throw new Error('Usage: npm run cli -- create-project "Project name"');
        }

        await cli.createProject(projectName);
        break;
      }

      case 'create-task': {
        const [projectIdArg, title, assigneeUserId] = args;
        const projectId = Number(projectIdArg);

        if (!projectIdArg || !title || Number.isNaN(projectId)) {
          throw new Error(
            'Usage: npm run cli -- create-task <projectId> "Task title" [assigneeUserId]',
          );
        }

        await cli.createTask(projectId, title, assigneeUserId);
        break;
      }

      case 'seed-demo': {
        await cli.seedDemo();
        break;
      }

      default: {
        console.log('Available commands:');
        console.log('  npm run cli -- create-project "Project name"');
        console.log(
          '  npm run cli -- create-task <projectId> "Task title" [assigneeUserId]',
        );
        console.log('  npm run cli -- seed-demo');
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

bootstrap();