describe('Reihung', () => {
  describe('Frankfurt Hbf', () => {
    beforeEach(() => {
      cy.mockFrankfurt();
      cy.visit('/');
      cy.intercept(
        {
          url: '/api/reihung/v2/wagen/371/2019-08-07T12:50:00.000Z?*',
          query: {
            trainType: 'ICE',
            evaNumber: '8000105',
          },
        },
        {
          fixture: 'sequence/genericICE1',
        },
      );
      cy.navigateToStation('Frankfurt (Main) Hbf');
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
      cy.intercept(
        {
          url: '/api/reihung/v2/wagen/537/2020-02-22T11:26:00.000Z?*',
          query: {
            trainType: 'ICE',
            evaNumber: '8000152',
          },
        },
        {
          fixture: 'sequence/537Wing',
        },
      ).as('537');
      cy.intercept(
        {
          url: '/api/reihung/v2/wagen/587/2020-02-22T11:26:00.000Z?*',
          query: {
            trainType: 'ICE',
            evaNumber: '8000152',
          },
        },
        {
          statusCode: 404,
        },
      ).as('587');
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
