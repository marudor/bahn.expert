describe('Query Parameter', () => {
  it('noHeader on homepage', () => {
    cy.visit('/');
    cy.findByTestId('header').should('be.visible');
    cy.visit('/?noHeader=true');

    cy.findByTestId('abfahrtenHeader').should('not.exist');
  });

  it('noHeader on regional homepage', () => {
    cy.visit('/regional');
    cy.findByTestId('header').should('be.visible');
    cy.visit('/regional?noHeader=true');

    cy.findByTestId('header').should('not.exist');
  });

  it('Lookbehind not saving in cookie', () => {
    cy.mockFrankfurt({ lookbehind: 20 });
    cy.visit('/');
    cy.openSettings();
    cy.findByTestId('lookbehind').within(() => {
      cy.get('select').select('20');
    });
    cy.getCookie('lookbehind').should('have.property', 'value', '20');
    cy.mockFrankfurt({ lookbehind: 150 });
    cy.visit('/Frankfurt (Main) Hbf?lookbehind=150');
    cy.getCookie('lookbehind').should('have.property', 'value', '20');
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.getCookie('lookbehind').should('have.property', 'value', '20');
  });

  it('can set startTime for departures', () => {
    const startTimeIso = '2023-01-14T08:00:00.000Z';
    cy.mockFrankfurt({
      startTime: new Date(startTimeIso),
    });
    // This ensures that the backend call includes startTime
    cy.visit(`/Frankfurt (Main) Hbf?startTime=${startTimeIso}`);
  });
});
