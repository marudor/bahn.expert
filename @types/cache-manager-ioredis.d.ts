declare module 'cache-manager-ioredis' {
  import { Store } from 'cache-manager';

  const redisStore: Store;
  export default redisStore;
}
