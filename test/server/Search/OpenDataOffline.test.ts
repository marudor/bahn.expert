import { testHamburgSearch } from './common';
import exampleRespone from './__fixtures__/OpenDataOffline.example';
import OpenDataOfflineSearch from 'server/Search/OpenDataOffline';

describe('DBNavigator Search', () => {
  it('Returns correct mapping', async () => {
    await testHamburgSearch(OpenDataOfflineSearch, {
      customResponse: exampleRespone,
    });
  });
});
