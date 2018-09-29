// @flow
import exampleRespone from './__fixtures__/Hafas.example';
import HafasSearch from 'server/Search/Hafas';
import Nock from 'nock';

describe('Hafas Search', () => {
  // if (process.env.ONLINE_TEST) {
  //   it('success Search', async () => {
  //     const result = await HafasSearch('Bochum');
  //
  //     expect(result).not.toHaveLength(0);
  //     expect(result).toMatchSnapshot();
  //   });
  // }

  describe('Mocked Test', () => {
    beforeAll(() => {
      Nock.disableNetConnect();
    });
    afterAll(() => {
      Nock.enableNetConnect();
    });

    it('Returns correct mapping', async () => {
      Nock('http://reiseauskunft.bahn.de')
        .get('/bin/ajax-getstop.exe/dn')
        .query({
          S: 'Hamburg*',
        })
        .reply(200, exampleRespone);

      const result = await HafasSearch('Hamburg');

      expect(result).not.toHaveLength(0);
      expect(result).toEqual([{ id: '8002548', title: 'Hamburg Dammtor' }, { id: '8002549', title: 'Hamburg Hbf' }]);
    });

    it('Throws exception on error', async () => {
      try {
        await HafasSearch('Hamburg');
        expect(true).toBeFalse();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });
});
