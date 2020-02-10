describe('Map', () => {
  it('opens oebb by default', () => {
    cy.server().route({
      url: '/api/hafas/v1/journeyGeoPos?profile=oebb',
      method: 'POST',
      response: 'fixture:journeyGeoPosOebbSingle.json',
    });
    cy.visit('/map');
    cy.findByAltText('test train').should('exist');
  });

  describe('query parameter', () => {
    const checkSetting = (setting: string, value: boolean) => {
      cy.visit(`/map?${setting}=${value === false ? '' : value}`);
      cy.findByTestId('trainSettingsIcon').click();
      cy.findByTestId(`${setting}Switch`)
        .find('input')
        .should(value ? 'be.checked' : 'be.not.checked');
    };

    it('profile', () => {
      cy.server({
        force404: true,
      }).route({
        url: '/api/hafas/v1/journeyGeoPos?profile=db',
        method: 'POST',
        response: 'fixture:journeyGeoPosOebbSingle.json',
      });
      cy.visit('/map?profile=db');
      cy.findByAltText('test train').should('exist');
    });

    it('onlyRT', () => {
      checkSetting('onlyRT', true);
      checkSetting('onlyRT', false);
    });

    it('includeNV', () => {
      checkSetting('includeNV', true);
      checkSetting('includeNV', false);
    });

    it('includeFV', () => {
      checkSetting('includeFV', true);
      checkSetting('includeFV', false);
    });

    it('permanent', () => {
      checkSetting('permanent', true);
      checkSetting('permanent', false);
    });
  });
});
