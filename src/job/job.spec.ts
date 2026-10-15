import { JobRepository } from '../job-execution/job.repository.interface';
import { JobExecution } from '../job-execution/job-execution';
import { StepExecution } from '../job-execution/step-execution';
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

    await expect(job.execute()).rejects.toThrow('Error!!');

    expect(step2Execute).not.toHaveBeenCalled();
  });
});

describe('Job 실행 이력', () => {
  type Saved = Record<string, unknown>;

  // 저장 시점의 상태를 복사해서 쌓는다. 같은 객체 참조를 쌓으면 마지막 상태만 남는다.
  function createRecordingRepository() {
    const jobs: Saved[] = [];
    const steps: Saved[] = [];

    const repository: JobRepository = {
      async saveJobExecution(execution: JobExecution) {
        jobs.push(JSON.parse(JSON.stringify(execution)) as Saved);
        return execution;
      },
      async saveStepExecution(execution: StepExecution) {
        steps.push(JSON.parse(JSON.stringify(execution)) as Saved);
        return execution;
      },
    };

    return { repository, jobs, steps };
  }

  it('모든 Step이 성공하면 마지막에 한 번만 COMPLETED로 저장한다.', async () => {
    const { repository, jobs } = createRecordingRepository();

    const step1: Step = { name: 'Step 1', async execute() {} };
    const step2: Step = { name: 'Step 2', async execute() {} };

    const job = new Job('Test Job', [step1, step2], repository);

    await job.execute();

    expect(jobs.map((saved) => saved.status)).toStrictEqual([
      'RUNNING',
      'COMPLETED',
    ]);
  });

  it('Step이 실패하면 잡은 FAILED로, 실패한 Step은 이력에 FAILED로 남는다.', async () => {
    const { repository, jobs, steps } = createRecordingRepository();

    const step1: Step = { name: 'Step 1', async execute() {} };
    const step2: Step = {
      name: 'Step 2',
      async execute() {
        throw new Error('Error!!');
      },
    };

    const job = new Job('Test Job', [step1, step2], repository);

    await expect(job.execute()).rejects.toThrow('Error!!');

    expect(jobs[jobs.length - 1].status).toBe('FAILED');

    const lastStatusOf = (stepName: string) =>
      steps.filter((saved) => saved.stepName === stepName).pop()?.status;

    expect(lastStatusOf('Step 1')).toBe('COMPLETED');
    expect(lastStatusOf('Step 2')).toBe('FAILED');
  });
});
