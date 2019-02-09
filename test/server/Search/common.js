// @flow
/* eslint import/prefer-default-export: 0 */
import type { Station } from 'types/abfahrten';

type BuiltOptions = {|
  includeFavendoId?: boolean,
  includeDS100?: boolean,
|};
type CustomOptions = {|
  customResponse: Station[],
|};
type Options = BuiltOptions | CustomOptions;

function buildResults(options: Options): any[] {
  if (options.customResponse) {
    return options.customResponse;
  }
  const Hbf: Station = { id: '8002549', title: 'Hamburg Hbf' };
  const Dammtor: Station = { id: '8002548', title: 'Hamburg Dammtor' };

  if (options.includeDS100) {
    Hbf.DS100 = 'AH';
    Dammtor.DS100 = 'ADF';
  }
  if (options.includeFavendoId) {
    Hbf.favendoId = 2514;
    Dammtor.favendoId = 2513;
  }

  return [Hbf, Dammtor];
}

export async function testHamburgSearch(searchFn: string => Promise<Station[]>, options?: Options = ({}: any)) {
  const result = await searchFn('Hamburg');

  const expectedResult = buildResults(options);

  expect(result).toHaveLength(expectedResult.length);
  expect(result).toEqual(expect.arrayContaining(expectedResult));
}
