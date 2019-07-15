// import { Selector } from 'testcafe';

// fixture`Station Search`.page(process.env.E2E_URL || '');

// test('Clearable station', async t => {
//   const inputSelector = '[data-testid="stationSearch"] input';
//   const singleValueSelector = '[data-testid="singleValue"]';
//   const placeholderSelector = '[data-testid="placeholder"]';

//   await t.typeText(inputSelector, 'Kiel Hbf');
//   const firstResult = Selector('[data-testid="menuItem"]');

//   await t.expect(firstResult.textContent).eql('Kiel Hbf');
//   await t.click(firstResult);
//   await t.expect(Selector(singleValueSelector).textContent).eql('Kiel Hbf');
//   await t.expect(Selector(placeholderSelector).exists).notOk();
//   await t
//     .click(inputSelector)
//     .pressKey('backspace')
//     .expect(Selector(placeholderSelector).exists)
//     .ok();
//   await t.expect(Selector(singleValueSelector).exists).notOk();
// });
