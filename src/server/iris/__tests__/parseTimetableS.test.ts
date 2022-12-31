/* eslint-disable unicorn/prefer-module */
/* eslint no-sync: 0 */
import { Timetable } from 'server/iris/Timetable';
import fs from 'node:fs';
import path from 'node:path';
import xmljs from 'libxmljs2';
import type { Element } from 'libxmljs2';

describe('parseTimetableS', () => {
  const baseFixturePath = '__fixtures__/plan';
  const fixtures = fs.readdirSync(path.resolve(__dirname, baseFixturePath));

  for (const file of fixtures) {
    // eslint-disable-next-line jest/valid-title
    it(file, () => {
      const timetable = new Timetable('test', 'test', {
        lookahead: 0,
        lookbehind: 0,
      });
      const inXml = fs.readFileSync(
        path.resolve(__dirname, baseFixturePath, file),
        'utf8',
      );
      const nodes = xmljs.parseXml(inXml).find<Element>('//timetable/s');

      for (const n of nodes)
        expect(timetable.parseTimetableS(n, {})).toMatchSnapshot();
    });
  }
});
