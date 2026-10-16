import { randomUUID } from 'crypto';
import { ExecutionStatus } from './job-execution';

interface StepExecutionProps {
  id?: string;
  jobExecutionId: string;
  stepName: string;
  status?: ExecutionStatus;
}

export class StepExecution {
  public readonly id: string = randomUUID();
  public readonly jobExecutionId: string;
  public readonly stepName: string;
  public status: ExecutionStatus = ExecutionStatus.RUNNING;
  public readonly startTime: Date = new Date();
  public endTime: Date | null = null;
  public errorMessage: string | null = null;

  constructor(props: StepExecutionProps) {
    this.jobExecutionId = props.jobExecutionId;
    this.stepName = props.stepName;
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
