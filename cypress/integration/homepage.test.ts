describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const currentFFMCookie =
    '%7B%228000105%22%3A%7B%22name%22%3A%22Frankfurt(Main)Hbf%22%2C%22evaNumber%22%3A%228000105%22%7D%7D';

  const oldFFMCookie =
    '%7B%228000105%22%3A%7B%22title%22%3A%22Frankfurt(Main)Hbf%22%2C%22id%22%3A%228000105%22%7D%7D';

  it('Theme Selection', () => {
    function openThemeSelection() {
      cy.findByTestId('navToggle').click();
      cy.findByTestId('themes').click();
    }
    openThemeSelection();
    cy.findByTestId('themeList').find('[data-value="black"]').click();
    cy.getCookie('theme').should('have.property', 'value', 'black');
    cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)');
    openThemeSelection();
    cy.findByTestId('themeList').find('[data-value="light"]').click();
    cy.getCookie('theme').should('have.property', 'value', 'light');
    cy.get('body').should('have.css', 'background-color', 'rgb(250, 250, 250)');
    openThemeSelection();
    cy.findByTestId('themeList').find('[data-value="dark"]').click();
    cy.getCookie('theme').should('have.property', 'value', 'dark');
    cy.get('body').should('have.css', 'background-color', 'rgb(48, 48, 48)');
  });

  it('Favorite', () => {
    cy.findByTestId('noFav').should('be.visible');
    cy.mockFrankfurt();
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.findByTestId('menu').click();
    cy.findByTestId('toggleFav').click();
    cy.findByTestId('menu').click();
    cy.findByTestId('toggleFav').should('include.text', 'Unfav');
    cy.visit('/');
    cy.findByTestId('favEntry').should('have.text', 'Frankfurt (Main) Hbf');
  });

  it('Shows error on mainPage', () => {
    cy.intercept('/api/iris/v2/abfahrten/8000105', {
      statusCode: 500,
      delayMs: 2000,
      body: {},
    }).intercept(
      `/api/stopPlace/v1/search/${encodeURIComponent('Frankfurt (Main) Hbf')}`,
      {
        fixture: 'stopPlaceSearchFrankfurtHbf',
      },
    );
    cy.force404();
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.findByTestId('loading').should('exist');
    cy.findByTestId('error').should('exist');
    cy.findByTestId('triedStation').should('have.text', 'Frankfurt (Main) Hbf');
  });

  it('shows favs from cookie', () => {
    cy.force404();
    cy.setCookie('favs', currentFFMCookie);
    cy.visit('/');
    cy.findByTestId('favEntry').should('have.text', 'Frankfurt(Main)Hbf');
  });

  it('shows favs from cookie (old format)', () => {
    cy.force404();
    cy.setCookie('favs', oldFFMCookie);
    cy.visit('/');
    cy.findByTestId('favEntry').should('have.text', 'Frankfurt(Main)Hbf');
    cy.getCookie('favs').should(
      'have.property',
      'value',
      decodeURIComponent(currentFFMCookie),
    );
  });
});
