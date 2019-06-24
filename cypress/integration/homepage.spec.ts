/// <reference types="Cypress" />

context('Homepage', () => {
  beforeEach(() => {
    cy.visit(global.testUrl);
  });
  it('Use Search', () => {
    cy.server();
    cy.route('GET', '/api/station/current/search/Hamburg?type=0').as(
      'stationSearchRequest'
    );
    cy.get('[data-testid="stationSearch"] input')
      .type('Hamburg', { force: true })
      .should('have.value', 'Hamburg');

    cy.wait('@stationSearchRequest');
    cy.get('[data-testid="menuItem"]:first').should('have.text', 'Hamburg Hbf');
  });

  it.only('Select theme', () => {
    cy.get('[data-testid="themeMenu"]').click();
    cy.get('[data-testid="themeRadioGroup"] [value="light"]').click();
    cy.getCookie('theme').should('have.property', 'value', 'light');
    cy.get('body').should('have.css', 'background-color', 'rgb(250, 250, 250)');
    cy.get('[data-testid="themeRadioGroup"] [value="black"]').click();
    cy.getCookie('theme').should('have.property', 'value', 'black');
    cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)');
    cy.get('[data-testid="themeRadioGroup"] [value="dark"]').click();
    cy.getCookie('theme').should('have.property', 'value', 'dark');
    cy.get('body').should('have.css', 'background-color', 'rgb(48, 48, 48)');
  });
});
