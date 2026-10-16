import { ExecutionStatus, JobExecution } from '../job-execution/job-execution';
import { JobRepository } from '../job-execution/job.repository.interface';
import { Job } from './job';
import { Step } from './step.interface';

const jobRepository: JobRepository = {
  saveJobExecution: jest.fn(),
  saveStepExecution: jest.fn(),
};

describe('Step 실행 순서', () => {
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

    expect(step2Execute).not.toHaveBeenCalled();
  });
});

describe('Job 실행 상태', () => {
  it('Step을 모두 실행하면 Job이 성공한다.', async () => {
    const step1: Step = {
      name: 'Step 1',
      async execute() {},
    };

    const step2: Step = {
      name: 'Step 2',
      async execute() {},
    };

    const job = new Job('Test Job', [step1, step2], jobRepository);
    const jobExecution = await job.execute();

    expect(jobExecution.status).toBe(ExecutionStatus.COMPLETED);
  });

  it('Step 에서 오류가 발생하면 Job도 실패한다.', async () => {
    const step: Step = {
      name: 'Step',
      async execute() {
        throw new Error('Error!!');
      },
    };

    const job = new Job('Test Job', [step], jobRepository);

    const jobExecution = await job.execute();

    expect(jobExecution.status).toBe(ExecutionStatus.FAILED);
  });
});

describe('Step 실행 상태', () => {
  it('Step이 성공한다.', async () => {
    const step: Step = {
      name: 'Step',
      async execute() {},
    };

    const job = new Job('Test Job', [step], jobRepository);

    const jobExecution = await job.execute();
    const stepExecution = jobExecution.stepExecutions[0];

    expect(stepExecution.status).toBe(ExecutionStatus.COMPLETED);
  });

  it('Step이 실패한다.', async () => {
    const expectedStepName = 'Test Step';

    const step: Step = {
      name: expectedStepName,
      async execute() {
        throw new Error('error!!');
      },
    };

    const job = new Job('Test Job', [step], jobRepository);

    const jobExecution = await job.execute();
    const stepExecution = jobExecution.stepExecutions[0];

    expect(stepExecution.status).toBe(ExecutionStatus.FAILED);
    expect(stepExecution.stepName).toBe(expectedStepName);
  });
});
