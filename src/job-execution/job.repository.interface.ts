import { JobExecution } from './job-execution';

export interface JobRepository {
  save(execution: JobExecution): Promise<JobExecution>;
}
