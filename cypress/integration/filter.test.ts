describe('Filter', () => {
  function openFilter() {
    cy.getByTestId('menu').click();
    cy.getByTestId('openFilter').click();
  }
  beforeEach(() => {
    cy.server();
    cy.route(
      '/api/station/current/search/Frankfurt (Main) Hbf?type=0',
      'fixture:stationSearchFrankfurtHbf.json'
    ).route(
      '/api/iris/current/abfahrten/8098105?lookahead=150&lookbehind=0',
      'fixture:abfahrtenFrankfurtHbf.json'
    );
  });
  it('Type Filter Temporary', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getAllByTestId('abfahrtStart')
      .getAllByText('S 7')
      .should('exist');
    openFilter();
    cy.getByTestId('filterS').click();
    cy.closeModal();
    cy.getAllByTestId('abfahrtStart')
      .queryByText('S 7')
      .should('not.exist');
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getAllByTestId('abfahrtStart')
      .getAllByText('S 7')
      .should('exist');
  });

  it('Type Filter default', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getAllByTestId('abfahrtStart')
      .getAllByText('S 7')
      .should('exist');
    openFilter();
    cy.getByTestId('filterS').click();
    cy.getByTestId('filterSubmit').click();
    cy.getAllByTestId('abfahrtStart')
      .queryByText('S 7')
      .should('not.exist');
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getAllByTestId('abfahrtStart')
      .queryByText('S 7')
      .should('not.exist');
  });

  it('onlyDepartures', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getAllByTestId('abfahrtStart')
      .getByText('ICE 1632')
      .should('exist');
    cy.visit('/?onlyDepartures=true');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getAllByTestId('abfahrtStart')
      .queryByText('ICE 1632')
      .should('not.exist');
  });
});
