import { JobRepository } from '../job-execution/job.repository.interface';
import { Job } from './job';
import { Step } from './step.interface';

const jobRepository: JobRepository = {
  saveJobExecution: jest.fn(),
  saveStepExecution: jest.fn(),
};

describe('Step 1. 배치 작업 실행하기', () => {
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

describe('Step 2. 실행 상태와 이력 관리하기', () => {
  it.todo('정상 실행과 실패 실행의 이력을 각각 조회할 수 있다.');
  it.todo('어떤 단계에서 실패했는지 확인할 수 있다.');
  it.todo(
    '실행 중간에 프로세스가 종료되는 상황을 가정하고, 이력에 어떤 문제가 생기는지 확인한다.',
  );
});
