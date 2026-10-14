import { randomUUID } from 'crypto';

interface JobExecutionProps {
  id?: string;
  jobName: string;
  status?: 'RUNNING' | 'COMPLETED' | 'FAILED';
  startTime?: Date;
  endTime?: Date | null;
  errorMessage?: string | null;
}

export class JobExecution {
  private readonly id: string;
  private readonly jobName: string;
  private status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  private readonly startTime: Date;
  private endTime: Date | null;
  private errorMessage: string | null;

  constructor(props: JobExecutionProps) {
    this.id = props.id ?? randomUUID();
    this.jobName = props.jobName;
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
