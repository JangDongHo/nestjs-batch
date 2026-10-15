import { Logger } from '@nestjs/common';
import { Step } from './step.interface';
import { JobRepository } from '../job-execution/job.repository.interface';
import { JobExecution } from '../job-execution/job-execution';
import { StepExecution } from '../job-execution/step-execution';

export class Job {
  constructor(
    public readonly name: string,
    private readonly steps: Step[],
    private readonly jobRepository: JobRepository,
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
        jobExecutionId: jobExecution.getId(),
      });

      await this.jobRepository.saveStepExecution(stepExecution);

      let failure: unknown;
      let failed = false;

      try {
        await step.execute();
      } catch (error) {
        failed = true;
        failure = error;
      }

      if (failed) {
        this.printErrorLog(step.name, failure);

        stepExecution.fail(String(failure));
        await this.jobRepository.saveStepExecution(stepExecution);

        jobExecution.fail(String(failure));
        await this.jobRepository.saveJobExecution(jobExecution);

        throw failure;
      }

      this.printLog(step.name);
      stepExecution.complete();
      await this.jobRepository.saveStepExecution(stepExecution);
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
}
