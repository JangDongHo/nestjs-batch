import { JobExecution } from './job-execution';
import { StepExecution } from './step-execution';

export interface JobRepository {
  saveJobExecution(execution: JobExecution): Promise<JobExecution>;
  saveStepExecution(execution: StepExecution): Promise<StepExecution>;
}
