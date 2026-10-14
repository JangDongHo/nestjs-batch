import { JobRepository } from './job.repository.interface';
import SimpleJsonDB from 'simple-json-db';
import { JobExecution } from './job-execution';

export class JsonJobRepository implements JobRepository {
  private readonly db = new SimpleJsonDB('./job-execution.json');

  async save(execution: JobExecution): Promise<JobExecution> {
    const key = execution.getId();
    this.db.set(key, execution);

    return execution;
  }
}
