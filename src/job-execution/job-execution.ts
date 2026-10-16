import { randomUUID } from 'crypto';
import { StepExecution } from './step-execution';

export const ExecutionStatus = {
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type ExecutionStatus =
  (typeof ExecutionStatus)[keyof typeof ExecutionStatus];

interface JobExecutionProps {
  id?: string;
  jobName: string;
  status?: ExecutionStatus;
  startTime?: Date;
  endTime?: Date | null;
  errorMessage?: string | null;
}

export class JobExecution {
  public readonly id: string = randomUUID();
  public readonly jobName: string;
  public status: ExecutionStatus = ExecutionStatus.RUNNING;
  public readonly startTime: Date = new Date();
  public endTime: Date | null = null;
  public errorMessage: string | null = null;
  public stepExecutions: StepExecution[] = [];

  constructor(props: JobExecutionProps) {
    this.jobName = props.jobName;
  }

  addStepExecution(execution: StepExecution): void {
    this.stepExecutions.push(execution);
  }

  complete(): void {
    this.status = ExecutionStatus.COMPLETED;
    this.endTime = new Date();
  }

  fail(errorMessage: string): void {
    this.status = ExecutionStatus.FAILED;
    this.endTime = new Date();
    this.errorMessage = errorMessage;
  }
}
