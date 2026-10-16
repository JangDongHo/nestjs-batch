import { JobRepository } from './job.repository.interface';
import SimpleJsonDB from 'simple-json-db';
import { JobExecution } from './job-execution';
import { StepExecution } from './step-execution';

export class JsonJobRepository implements JobRepository {
  private readonly db = new SimpleJsonDB('./job-execution.json');

  async saveJobExecution(execution: JobExecution): Promise<JobExecution> {
    const key = execution.id;
    this.db.set(`jobExecutions:${key}`, execution);

    return execution;
  }

  async saveStepExecution(execution: StepExecution): Promise<StepExecution> {
    const key = execution.id;
    this.db.set(`stepExecutions:${key}`, execution);

    return execution;
  }
}
