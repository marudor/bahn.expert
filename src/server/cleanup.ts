const signalsToHandle: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

export function registerCleanup(fn: (signal: NodeJS.Signals) => void) {
  for (const signal of signalsToHandle) {
    process.on(signal, fn);
  }
}
