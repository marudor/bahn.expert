// flow-typed signature: a865cf1b7ee719c2a40b85dc8dccf56c
// flow-typed version: fc3f3a2e99/lolex_v2.x.x/flow_>=v0.64.x

// @flow
declare module 'lolex' {
  declare opaque type ImmediateID;
  declare type installConfig = {
    target?: Object,
    now?: number | Date,
    toFake?: string[],
    loopLimit?: number,
    shouldAdvanceTime?: boolean,
    advanceTimeDelta?: number,
  };
  declare type lolex = {
    createClock(now?: number, loopLimit?: number): Clock,
    install(config?: installConfig): Clock,
    withGlobal(global: Object): lolex,
  };
  declare class Clock {
    setTimeout: typeof setTimeout;
    clearTimeout: typeof clearTimeout;
    setInterval: typeof setInterval;
    clearInterval: typeof clearInterval;
    setImmediate: typeof setImmediate;
    clearImmediate: typeof clearImmediate;
    requestAnimationFrame: typeof requestAnimationFrame;
    cancelAnimationFrame: typeof cancelAnimationFrame;
    hrtime: typeof process.hrtime;
    nextTick: typeof process.nextTick;
    performace: {
      now: typeof performance.now,
    };
    tick(time: number | string): void;
    next(): void;
    reset(): void;
    runAll(): void;
    runMicrotasks(): void;
    runToFrame(): void;
    runToLast(): void;
    setSystemTime(now?: Date): void;
    uninstall(): void;
    Date: typeof Date;
    Performance: typeof Performance;
  }
  declare module.exports: lolex;
}
