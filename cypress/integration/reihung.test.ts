describe('Reihung', () => {
  describe('Frankfurt Hbf', () => {
    beforeEach(() => {
      cy.mockFrankfurt();
      cy.visit('/');
      cy.navigateToStation('Frankfurt (Main) Hbf');
      cy.route(
        '/api/hafas/v1/auslastung/8000105/Interlaken Ost/371/1565182200000',
        { first: 1, second: 1 }
      );
      cy.route(
        '/api/reihung/v1/wagen/371/1565182200000',
        'fixture:sequence/genericICE1.json'
      );
      cy.findByTestId('abfahrtICE371').click();
    });

    it('loads Reihung', () => {
      cy.findByTestId('reihung').should('exist');
    });

    it('Legend useable', () => {
      cy.findByTestId('reihungLegendOpener').click();
      cy.findByTestId('reihungLegend').should('exist');
      cy.closeModal();
      cy.findByTestId('reihung').should('exist');
    });

    it('Sitzplatzinfo', () => {
      cy.findByTestId('reihungFahrzeug11').within(() => {
        cy.findByTestId('sitzplatzinfoToggle').click();
      });
      cy.findByTestId('sitzplatzinfoComfort').should('exist');
      cy.closeModal();
      cy.findByTestId('reihungFahrzeug7').within(() => {
        cy.findByTestId('sitzplatzinfoToggle').click();
      });
      cy.findByTestId('sitzplatzinfoComfort').should('exist');
      cy.findByTestId('sitzplatzinfoDisabled').should('exist');
    });
  });

  describe('Hannover Hbf', () => {
    beforeEach(() => {
      cy.mockHannover();
      cy.visit('/');
      cy.navigateToStation('Hannover Hbf');
      cy.route(
        '/api/reihung/v1/wagen/537/1582370760000',
        'fixture:sequence/537Wing.json'
      ).as('537');
      cy.route({
        method: 'GET',
        url: '/api/reihung/v1/wagen/587/1582370760000',
        status: 404,
        response: '',
      }).as('587');
    });
    it('only loads reihung of selected train if available', () => {
      cy.findByTestId('abfahrtICE537').click();
      cy.wait('@537');
    });

    it('fallback to wing number', () => {
      cy.findByTestId('abfahrtICE587').click();
      cy.wait('@587');
      cy.wait('@537');
    });
  });
});
