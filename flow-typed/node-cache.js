declare module 'node-cache' {
  declare type CacheOptions = {
    stdTTL?: number,
    checkperiod?: number,
    errorOnMissing?: boolean,
    useClones?: boolean,
    deleteOnExpire?: boolean,
  };
  declare type Stats = {
    keys: number,
    hits: number,
    misses: number,
    ksize: number,
    vsize: number,
  };
  declare class NodeCache<Key, Value> {
    constructor(options?: CacheOptions): NodeCache<Key, Value>;
    set(key: Key, value: Value, ttl?: number, cb?: (err: ?any, success: ?true) => any): ?true;
    get(key: Key, cb?: (err: ?any, value: ?Value) => any): ?Value;
    mget<V: {[key: Key]: Value}>(keys: Key[], cb?: (err: ?any, value: V) => any): V;
    del(key: Key, cb?: (err: ?any, count: number) => any): number;
    mdel(keys: Key[], cb?: (err: ?any, count: number) => any): number;
    ttl(key: Key, ttl: number, cb?: (err: ?any, changed: boolean) => any): boolean;
    getTtl(key: Key, cb?: (err: ?any, ttl: ?number) => any): ?number;
    keys(cb?: (err: ?any, keys: Key[]) => any): Key[];
    getStats(): Stats;
    flushAll(): void;
    close(): void;
  }
  declare module.exports: typeof NodeCache;
}
