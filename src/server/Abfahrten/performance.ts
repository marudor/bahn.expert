/* eslint no-await-in-loop: 0 no-console: 0 */
import { getAbfahrten, noncdAxios, openDataAxios } from '.';
import { max, min, sum } from 'lodash';
// eslint-disable-next-line import/no-unresolved
import { performance, PerformanceObserver } from 'perf_hooks';

const timeMap = {
  noncd: [] as number[],
  openData: [] as number[],
};
const obs = new PerformanceObserver(items => {
  items.getEntries().forEach(e => {
    const type = e.name.startsWith('noncd') ? 'noncd' : 'openData';

    timeMap[type].push(e.duration);
    console.log(e.name, e.duration);
  });
  performance.clearMarks();
});

obs.observe({ entryTypes: ['measure'] });

async function testFn(fn: Function) {
  for (let i = 0; i < 10; i += 1) {
    const fnName = `${fn.name}${i}`;
    const start = `${fnName}start`;
    const end = `${fnName}end`;

    performance.mark(start);
    await fn();
    performance.mark(end);
    performance.measure(fnName, start, end);
  }

  const times = timeMap[fn.name as keyof typeof timeMap];
  const Σ = sum(times);
  const mi = min(times);
  const ma = max(times);

  return {
    Σ,
    mi,
    ma,
    avg: Σ / times.length,
  };
}

function noncd() {
  return getAbfahrten('8000207', true, undefined, noncdAxios);
}

function openData() {
  return getAbfahrten('8000207', true, undefined, openDataAxios);
}

Promise.all([noncd(), openData()])
  .then(async () => {
    const noncdResult = await testFn(noncd);
    const opendataResult = await testFn(openData);

    console.log(
      'noncd',
      'Σ',
      noncdResult.Σ,
      'avg',
      noncdResult.avg,
      'max',
      noncdResult.ma,
      'min',
      noncdResult.mi
    );
    console.log(
      'openData',
      'Σ',
      opendataResult.Σ,
      'avg',
      opendataResult.avg,
      'max',
      opendataResult.ma,
      'min',
      opendataResult.mi
    );
  })
  .catch(e => {
    console.log(e);
  });
