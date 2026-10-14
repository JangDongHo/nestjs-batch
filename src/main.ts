import { Step } from './step.interface';
import { Job } from './job';

const step1: Step = {
  name: 'Step 1',
  async execute() {
    throw new Error('error!!');
  },
};

const step2: Step = {
  name: 'Step 2',
  async execute() {
    console.log('Executing Step 2');
  },
};

async function bootstrap() {
  try {
    const job = new Job('Test Job', [step1, step2]);
    await job.execute();
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
