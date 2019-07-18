import { awaitLoading, setupTest } from './helper';
import { getByTestId, queryByTestId } from '@testing-library/testcafe';

setupTest('Station Search');

test('Clearable station', async t => {
  await t.typeText(getByTestId('stationSearch').find('input'), 'Kiel Hbf');
  const firstResult = queryByTestId('menuItem');

  await t.expect(firstResult.textContent).eql('Kiel Hbf');
  await t.click(firstResult);
  await t.expect(getByTestId('singleValue').textContent).eql('Kiel Hbf');
  await awaitLoading(t);
  await t.expect(queryByTestId('placeholder').exists).notOk();
  await t
    .click(getByTestId('stationSearch').find('input'))
    .pressKey('backspace')
    .expect(getByTestId('placeholder').exists)
    .ok();

  await t.expect(queryByTestId('singleValue').exists).notOk();
});
