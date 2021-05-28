describe('Map', () => {
  it('opens oebb by default', () => {
    cy.intercept(
      {
        url: '/api/hafas/v1/journeyGeoPos?profile=oebb',
        method: 'POST',
      },
      {
        fixture: 'journeyGeoPosOebbSingle',
      },
    ).as('geoPos');
    cy.visit('/map?noTiles=1');
    cy.wait('@geoPos');
  });

  describe('query parameter', () => {
    const checkSetting = (setting: string, value: boolean) => {
      cy.visit(`/map?${setting}=${value === false ? '' : value}&noTiles=1`);
      cy.findByTestId('trainSettingsIcon').click();
      cy.findByTestId(`${setting}Switch`)
        .find('input')
        .should(value ? 'be.checked' : 'be.not.checked');
    };

    it('profile', () => {
      cy.intercept(
        {
          url: '/api/hafas/v1/journeyGeoPos?profile=db',
          method: 'POST',
        },
        {
          fixture: 'journeyGeoPosOebbSingle',
        },
      ).as('geoPos');
      cy.visit('/map?profile=db&noTiles=1');
      cy.wait('@geoPos');
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
