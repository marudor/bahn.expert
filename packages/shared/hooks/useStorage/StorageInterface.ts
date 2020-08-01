export interface StorageInterface<KeyMap> {
  get<K extends keyof KeyMap>(name: K): KeyMap[K] | undefined;
  get<T = unknown>(name: string): T | undefined;
  set<K extends keyof KeyMap>(name: K, value: KeyMap[K]): void;
  set<T>(name: string, value: T): void;
  remove<K extends keyof KeyMap>(name: K): void;
  remove(name: string): void;
}
