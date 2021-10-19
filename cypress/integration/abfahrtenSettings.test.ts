describe('Abfahrten Settings', () => {
  describe('on Abfahrten Page', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.mockFrankfurt();
      cy.navigateToStation('Frankfurt (Main) Hbf');
    });

    it('Show Zugnummer & Linie', () => {
      cy.findByTestId('abfahrtS35744').within(() => {
        cy.findByTestId('abfahrtStart').should('have.text', 'S 7');
      });
      cy.openSettings();
      cy.findByTestId('lineAndNumberConfig').click();
      cy.closeModal();
      cy.findByTestId('abfahrtS35744').within(() => {
        cy.findByTestId('abfahrtStart').should('have.text', 'S 7S 35744');
      });
    });

    it('Show fahrzeuggruppe', () => {
      cy.intercept(
        {
          url: '/api/reihung/v4/wagen/371?*',
          query: {
            evaNumber: '8000105',
            departure: '2019-08-07T12:50:00.000Z',
          },
        },
        {
          fixture: 'sequence/genericICE1',
        },
      );
      cy.findByTestId('abfahrtICE371').click();
      cy.openSettings();
      cy.findByTestId('fahrzeugGruppeConfig').click();
      cy.closeModal();
      cy.findByTestId('reihungFahrzeugGruppe').should('exist');
    });

    it('Show uic', () => {
      cy.intercept(
        {
          url: '/api/reihung/v4/wagen/371?*',
          query: {
            evaNumber: '8000105',
            departure: '2019-08-07T12:50:00.000Z',
          },
        },
        {
          fixture: 'sequence/genericICE1',
        },
      );
      cy.findByTestId('abfahrtICE371').click();
      cy.openSettings();
      cy.findByTestId('showUIC').click();
      cy.closeModal();
      cy.findAllByTestId('uic').should('exist');
    });
  });

  it('set lookbehind', () => {
    cy.visit('/');
    cy.openSettings();
    cy.findByTestId('lookbehind').within(() => {
      cy.get('select').select('240');
    });
    cy.getCookie('lookbehind').should('have.property', 'value', '240');
  });
});
