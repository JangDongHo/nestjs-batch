import { Logger } from '@nestjs/common';
import { Step } from './step.interface';
import { JobRepository } from '../job-execution/job.repository.interface';
import { JsonJobRepository } from '../job-execution/json-job.repository';
import { JobExecution } from '../job-execution/job-execution';
import { StepExecution } from '../job-execution/step-execution';

export class Job {
  constructor(
    public readonly name: string,
    private readonly steps: Step[],
    private readonly jobRepository: JobRepository = new JsonJobRepository(),
    private readonly logger: Logger = new Logger(name),
  ) {}

  async execute(): Promise<void> {
    const jobExecution = new JobExecution({
      jobName: this.name,
    });

    await this.jobRepository.saveJobExecution(jobExecution);

    for (const step of this.steps) {
      const stepExecution = new StepExecution({
        stepName: step.name,
        jobId: jobExecution.getId(),
      });

      await this.jobRepository.saveStepExecution(stepExecution);

      try {
        await step.execute();
        this.printLog(step.name);

        stepExecution.complete();
        await this.jobRepository.saveStepExecution(stepExecution);
      } catch (error) {
        this.printErrorLog(step.name, error);

        jobExecution.fail(String(error));
        await this.jobRepository.saveJobExecution(jobExecution);

        stepExecution.fail(String(error));
        await this.jobRepository.saveStepExecution(stepExecution);

        throw error;
      }
    }

    jobExecution.complete();
    await this.jobRepository.saveJobExecution(jobExecution);
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
