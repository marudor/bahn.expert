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
      cy.percySnapshot('Zugnummer & Linie');
    });

    describe('CoachSequence', () => {
      beforeEach(() => {
        cy.intercept(
          {
            url: '/api/coachSequence/v4/wagen/371?*',
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
      });

      it('Show fahrzeuggruppe', () => {
        cy.findByTestId('fahrzeugGruppeConfig').click();
        cy.closeModal();
        cy.findByTestId('coachSequenceCoachGroup').should('exist');
        cy.percySnapshot('Fahrzeuggruppe');
      });

      it('Show uic', () => {
        cy.findAllByTestId('uic').should('not.exist');
        cy.findByTestId('showUIC').click();
        cy.closeModal();
        cy.findAllByTestId('uic').should('exist');
        cy.findByTestId('via-Berlin Ostbahnhof').should(
          'have.css',
          'text-decoration-line',
          'line-through',
        );
        cy.percySnapshot('UIC');
      });

      it('show coach type', () => {
        cy.findAllByTestId('coachType').should('not.exist');
        cy.findByTestId('showCoachType').click();
        cy.closeModal();
        cy.findAllByTestId('coachType').should('exist');
        cy.percySnapshot('coachType');
      });

      it('uic & coachType', () => {
        cy.findByTestId('showCoachType').click();
        cy.findByTestId('showUIC').click();
        cy.closeModal();
        cy.percySnapshot('UIC&coachType');
      });

      it('Full Info', () => {
        cy.findByTestId('fahrzeugGruppeConfig').click();
        cy.findByTestId('showUIC').click();
        cy.findByTestId('showCoachType').click();
        cy.closeModal();
        cy.percySnapshot('reihungFull');
      });
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
