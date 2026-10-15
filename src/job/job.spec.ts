import { JobRepository } from '../job-execution/job.repository.interface';
import { Job } from './job';
import { Step } from './step.interface';

const jobRepository: JobRepository = {
  saveJobExecution: jest.fn(),
  saveStepExecution: jest.fn(),
};

describe('Job', () => {
  it('Step을 등록한 순서대로 실행한다.', async () => {
    const executionOrder: string[] = [];

    const step1: Step = {
      name: 'Step 1',
      async execute() {
        executionOrder.push('Step 1');
      },
    };

    const step2: Step = {
      name: 'Step 2',
      async execute() {
        executionOrder.push('Step 2');
      },
    };

    const job = new Job('Test Job', [step1, step2], jobRepository);

    await job.execute();

    expect(executionOrder).toStrictEqual(['Step 1', 'Step 2']);
  });

  it('비동기 Step이 완료된 후 다음 Step을 진행한다.', async () => {
    const executionOrder: string[] = [];

    const step1: Step = {
      name: 'Step 1',
      async execute() {
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
        executionOrder.push('Step 1');
      },
    };

    const step2: Step = {
      name: 'Step 2',
      async execute() {
        executionOrder.push('Step 2');
      },
    };

    const job = new Job('Test Job', [step1, step2], jobRepository);

    await job.execute();

    expect(executionOrder).toStrictEqual(['Step 1', 'Step 2']);
  });

  it('Step에서 오류가 발생하면 다음 Step을 진행하지 않는다.', async () => {
    const step1: Step = {
      name: 'Step 1',
      async execute() {
        throw new Error('Error!!');
      },
    };

    const step2Execute = jest.fn();

    const step2: Step = {
      name: 'Step 2',
      execute: step2Execute,
    };

    const job = new Job('Test Job', [step1, step2], jobRepository);

    expect(job.execute()).rejects.toThrow('Error!!');

    expect(step2Execute).not.toHaveBeenCalled();
  });
});
