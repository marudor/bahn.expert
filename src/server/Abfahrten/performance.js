// @flow
/* eslint no-await-in-loop: 0, no-console: 0 */
import { ownAbfahrten } from '.';

async function measureOwn(evaId: string) {
  const ownStart = Date.now();

  await ownAbfahrten(evaId);
  const ownEnd = Date.now();

  const time = ownEnd - ownStart;

  console.log(`single own run: ${time}ms`);

  return time;
}

// async function measureDbf(evaId: string) {
//   process.env.DBF_HOST = 'http://localhost:3000';
//   const dbfStart = Date.now();

//   await dbfAbfahrten(evaId);
//   const dbfEnd = Date.now();

//   const time = dbfEnd - dbfStart;

//   console.log(`single dbf run: ${time}ms`);

//   return time;
// }

async function perfTest(evaId) {
  let own = 0;
  // let dbf = 0;
  const cycles = 15;

  console.log(`Testing Performance for ${evaId}\nUsing ${cycles} runs`);
  for (let i = 0; i < cycles; i += 1) {
    own += await measureOwn(evaId);
    // dbf += await measureDbf(evaId);
  }

  own /= cycles;
  // dbf /= cycles;

  console.log(`own: ${own}ms`);
  // console.log(`dbf: ${dbf}ms`);
}

perfTest('8002549');
