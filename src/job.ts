import { Step } from './step.interface';

export class Job {
  constructor(
    public readonly name: string,
    private readonly steps: Step[],
  ) {}

  async execute(): Promise<void> {
    for (const step of this.steps) {
      await step.execute();
    }
  }
}
