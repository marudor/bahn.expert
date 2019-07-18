import { ClientFunction, Selector } from 'testcafe';
import { getByTestId } from '@testing-library/testcafe';
import { setupTest } from './helper';

setupTest('Homepage');

const themeCookie = ClientFunction(() => {
  const c = document.cookie.split('; ').filter(x => x.startsWith('theme'));

  if (c.length) {
    return decodeURIComponent(c[0].split('=')[1]);
  }
});

test('Theme Selection', async t => {
  await t.click(getByTestId('themeMenu'));
  await t.click(getByTestId('themeRadioGroup').find('[value="black"]'));
  await t.expect(themeCookie()).eql('black');
  await t
    .expect((await Selector('body').style)['background-color'])
    .eql('rgb(0, 0, 0)');
  await t.click(getByTestId('themeRadioGroup').find('[value="light"]'));
  await t.expect(themeCookie()).eql('light');
  await t
    .expect((await Selector('body').style)['background-color'])
    .eql('rgb(250, 250, 250)');
  await t.click(getByTestId('themeRadioGroup').find('[value="dark"]'));
  await t.expect(themeCookie()).eql('dark');
  await t
    .expect((await Selector('body').style)['background-color'])
    .eql('rgb(48, 48, 48)');
});

test('Favorite', async t => {
  await t.expect(getByTestId('noFav')).ok();
  await t.navigateTo('/Kiel Hbf?lookahead=10');
  await t.click(getByTestId('menu'));
  await t.expect(getByTestId('toggleFav').textContent).contains('Fav');
  await t.click(getByTestId('toggleFav'));
  await t.click(getByTestId('menu'));
  await t.expect(getByTestId('toggleFav').textContent).contains('Unfav');
  await t.navigateTo('/');
  await t.expect(getByTestId('favEntry').textContent).contains('Kiel Hbf');
});
