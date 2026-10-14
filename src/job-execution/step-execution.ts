import { randomUUID } from 'crypto';

interface StepExecutionProps {
  id?: string;
  jobId: string;
  stepName: string;
  status?: 'RUNNING' | 'COMPLETED' | 'FAILED';
  startTime?: Date;
  endTime?: Date | null;
  errorMessage?: string | null;
}

export class StepExecution {
  private readonly id: string;
  private readonly jobId: string;
  private readonly stepName: string;
  private status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  private readonly startTime: Date;
  private endTime: Date | null;
  private errorMessage: string | null;

  constructor(props: StepExecutionProps) {
    this.id = props.id ?? randomUUID();
    this.jobId = props.jobId;
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
