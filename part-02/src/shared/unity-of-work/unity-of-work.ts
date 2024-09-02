export type Work = (session: any) => Promise<void>

export interface UnityOfWork {
  start(): Promise<void>;
  addWork(work: Work): void;
  commit(): Promise<void>;
  abort(): Promise<void>;
}