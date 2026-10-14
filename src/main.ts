import { Logger } from '@nestjs/common';
import { TestJob } from './jobs/test.job';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const job = new TestJob().create();

  try {
    await job.execute();
  } catch (error) {
    logger.error(`${job.name} 실패: ${error}}`);
  }
}
bootstrap();
