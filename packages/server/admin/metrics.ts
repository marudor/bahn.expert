import promClient from 'prom-client';

export const makeLabelPromCompatible = (
  labelName?: string,
): string | undefined => {
  return labelName
    ?.replaceAll('/', '_')
    .replaceAll('.*', 'STAR')
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll(':', 'I');
};

promClient.register.clear();
promClient.collectDefaultMetrics();

export const apiCounter = new promClient.Counter({
  name: 'ba_api_count',
  help: 'API Counter',
  labelNames: ['route', 'type'],
});
