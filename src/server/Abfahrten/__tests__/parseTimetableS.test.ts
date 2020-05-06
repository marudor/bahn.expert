/* eslint no-sync: 0 */
import { noncdAxios } from 'server/Abfahrten/helper';
import fs from 'fs';
import path from 'path';
import Timetable from 'server/Abfahrten/Timetable';
import xmljs, { Element } from 'libxmljs2';

describe('parseTimetableS', () => {
  const baseFixturePath = '__fixtures__/plan';
  const fixtures = fs.readdirSync(path.resolve(__dirname, baseFixturePath));

  fixtures.forEach((file) => {
    it(file, () => {
      const timetable = new Timetable(
        'test',
        'test',
        {
          lookahead: 0,
          lookbehind: 0,
        },
        noncdAxios
      );
      const inXml = fs.readFileSync(
        path.resolve(__dirname, baseFixturePath, file),
        'utf8'
      );
      const nodes = xmljs.parseXml(inXml).find<Element>('//timetable/s');

      nodes.forEach((n) =>
        expect(timetable.parseTimetableS(n)).toMatchSnapshot()
      );
    });
  });
});
