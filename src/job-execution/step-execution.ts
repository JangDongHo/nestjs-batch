import { randomUUID } from 'crypto';
import { ExecutionStatus } from './job-execution';

interface StepExecutionProps {
  id?: string;
  jobExecutionId: string;
  stepName: string;
  status?: ExecutionStatus;
  startTime?: Date;
  endTime?: Date | null;
  errorMessage?: string | null;
}

export class StepExecution {
  private readonly id: string;
  private readonly jobExecutionId: string;
  private readonly stepName: string;
  private status: ExecutionStatus;
  private readonly startTime: Date;
  private endTime: Date | null;
  private errorMessage: string | null;

  constructor(props: StepExecutionProps) {
    this.id = props.id ?? randomUUID();
    this.jobExecutionId = props.jobExecutionId;
    this.stepName = props.stepName;
    this.status = props.status ?? 'RUNNING';
    this.startTime = props.startTime ?? new Date();
    this.endTime = props.endTime ?? null;
    this.errorMessage = props.errorMessage ?? null;
  }

  getId(): string {
    return this.id;
  }

  complete(): void {
    this.status = 'COMPLETED';
    this.endTime = new Date();
  }

  fail(errorMessage: string): void {
    this.status = 'FAILED';
    this.endTime = new Date();
    this.errorMessage = errorMessage;
  }
}
