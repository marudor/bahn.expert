describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

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
    cy.intercept('/api/iris/v2/abfahrten/8098105', {
      statusCode: 500,
      delayMs: 2000,
      body: {},
    }).intercept(
      `/api/station/v1/search/${encodeURIComponent('Frankfurt (Main) Hbf')}`,
      {
        fixture: 'stationSearchFrankfurtHbf',
      },
    );
    cy.force404();
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.findByTestId('loading').should('exist');
    cy.findByTestId('error').should('exist');
    cy.findByTestId('triedStation').should('have.text', 'Frankfurt (Main) Hbf');
  });
});
