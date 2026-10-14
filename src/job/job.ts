import { Logger } from '@nestjs/common';
import { Step } from './step.interface';
import { JobRepository } from '../job-execution/job.repository.interface';
import { JsonJobRepository } from '../job-execution/json-job.repository';
import { JobExecution } from '../job-execution/job-execution';

export class Job {
  constructor(
    public readonly name: string,
    private readonly steps: Step[],
    private readonly jobRepository: JobRepository = new JsonJobRepository(),
    private readonly logger: Logger = new Logger(name),
  ) {}

  async execute(): Promise<void> {
    const execution = new JobExecution({
      jobName: this.name,
    });

    await this.jobRepository.save(execution);

    for (const step of this.steps) {
      try {
        await step.execute();
        this.printLog(step.name);
      } catch (error) {
        this.printErrorLog(step.name, error);
        execution.fail(String(error));
        await this.jobRepository.save(execution);
        throw error;
      }
    }

    execution.complete();
    await this.jobRepository.save(execution);
  }

  private printLog(stepName: string): void {
    this.logger.log(`${stepName} 성공`);
  }

  private printErrorLog(stepName: string, error: unknown): void {
    if (error instanceof Error) {
      this.logger.error(`${stepName} 실패: ${error}`, error.stack);
    } else {
      this.logger.error(`${stepName} 실패: ${error}`);
    }
  }

  private saveLog() {}
}
