/* eslint import/prefer-default-export: 0 */
import type { Station } from 'types/station';

interface BuiltOptions {
  includeDS100?: boolean;
}
interface CustomOptions {
  customResponse: Station[];
}
type Options = BuiltOptions | CustomOptions;

function buildResults(options: Options): any[] {
  if ('customResponse' in options) {
    return options.customResponse;
  }
  const Hbf: Station = {
    id: '8002549',
    title: 'Hamburg Hbf',
    DS100: options.includeDS100 ? 'AH' : undefined,
  };
  const Dammtor: Station = {
    id: '8002548',
    title: 'Hamburg Dammtor',
    DS100: options.includeDS100 ? 'ADF' : undefined,
  };

  return [Hbf, Dammtor];
}

export async function testHamburgSearch(
  searchFn: (s: string) => Promise<Station[]>,
  options: Options = {}
) {
  const result = await searchFn('Hamburg');

  const expectedResult = buildResults(options);

  expect(result).toHaveLength(expectedResult.length);
  expect(result).toEqual(expect.arrayContaining(expectedResult));
}
