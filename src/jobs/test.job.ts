import { Job } from '../job/job';
import { Step } from '../job/step.interface';

export class TestJob {
  create(): Job {
    const step1: Step = {
      name: 'Step 1',
      async execute() {
        console.log('Executing Step 1');
      },
    };

    const step2: Step = {
      name: 'Step 2',
      async execute() {
        console.log('Executing Step 2');
      },
    };

    return new Job('TestJob', [step1, step2]);
  }
}
