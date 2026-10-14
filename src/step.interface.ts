export interface Step {
  name: string;

  execute(): Promise<void>;
}
