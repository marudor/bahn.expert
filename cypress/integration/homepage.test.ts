describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Theme Selection', () => {
    cy.getByTestId('menu').click();
    cy.getByTestId('themeMenu').click();
    cy.getByTestId('themeRadioGroup')
      .find('[value="black"]')
      .click();
    cy.getCookie('theme').should('have.property', 'value', 'black');
    cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)');
    cy.getByTestId('themeRadioGroup')
      .find('[value="light"]')
      .click();
    cy.getCookie('theme').should('have.property', 'value', 'light');
    cy.get('body').should('have.css', 'background-color', 'rgb(250, 250, 250)');
    cy.getByTestId('themeRadioGroup')
      .find('[value="dark"]')
      .click();
    cy.getCookie('theme').should('have.property', 'value', 'dark');
    cy.get('body').should('have.css', 'background-color', 'rgb(48, 48, 48)');
  });

  it('Favorite', () => {
    cy.getByTestId('noFav').should('be.visible');
    cy.navigateToStation('Kiel Hbf');
    cy.getByTestId('menu').click();
    cy.getByTestId('toggleFav').click();
    cy.getByTestId('menu').click();
    cy.getByTestId('toggleFav').should('include.text', 'Unfav');
    cy.visit('/');
    cy.getByTestId('favEntry').should('have.text', 'Kiel Hbf');
  });
});
