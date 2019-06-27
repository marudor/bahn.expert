import { ClientFunction, Selector } from 'testcafe';

fixture`Getting Started`.page`https://beta.marudor.de`;

const themeCookie = ClientFunction(() => {
  const c = document.cookie.split('; ').filter(x => x.startsWith('theme'));

  if (c.length) {
    return decodeURIComponent(c[0].split('=')[1]);
  }
});

test('Theme Selection', async t => {
  await t.click('[data-testid="themeMenu"]');
  await t.click('[data-testid="themeRadioGroup"] [value="black"]');
  await t.expect(themeCookie()).eql('black');
  await t
    .expect((await Selector('body').style)['background-color'])
    .eql('rgb(0, 0, 0)');
  await t.click('[data-testid="themeRadioGroup"] [value="light"]');
  await t.expect(themeCookie()).eql('light');
  await t
    .expect((await Selector('body').style)['background-color'])
    .eql('rgb(250, 250, 250)');
  await t.click('[data-testid="themeRadioGroup"] [value="dark"]');
  await t.expect(themeCookie()).eql('dark');
  await t
    .expect((await Selector('body').style)['background-color'])
    .eql('rgb(48, 48, 48)');
});
