// @flow
import exampleRespone from './__fixtures__/Favendo.example';
import FavendoSearch from 'server/Search/Favendo';
import Nock from 'nock';

describe('Favendo Search', () => {
  // if (process.env.ONLINE_TEST) {
  //   it('success Search', async () => {
  //     const result = await FavendoSearch('Bochum');
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
      Nock('https://si.favendo.de')
        .get('/station-info/rest/api/search')
        .query({
          searchTerm: 'Hamburg',
        })
        .reply(200, exampleRespone);

      const result = await FavendoSearch('Hamburg');

      expect(result).not.toHaveLength(0);
      expect(result).toEqual([
        { favendoId: 2514, id: '8002549', title: 'Hamburg Hbf' },
        { id: '8002553', favendoId: 2517, title: 'Hamburg-Altona' },
        { id: '8002548', favendoId: 2513, title: 'Hamburg Dammtor' },
      ]);
    });

    it('Throws exception on error', async () => {
      try {
        await FavendoSearch('Hamburg');
        expect(true).toBeFalse();
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });
});
