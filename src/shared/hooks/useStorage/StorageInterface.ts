export default interface StorageInterface {
  get<T = any>(name: string): T;
  set<T>(name: string, value: T): void;
  remove(name: string): void;
}
