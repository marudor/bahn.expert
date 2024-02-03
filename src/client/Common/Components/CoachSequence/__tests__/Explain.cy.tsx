import {
  Explain,
  iconExplanation,
} from '@/client/Common/Components/CoachSequence/Explain';

describe('Explain', () => {
  function openLegende() {
    cy.mount(<Explain />);
    cy.findByTestId('coachSequenceLegendOpener').click();
  }

  for (const icon of Object.keys(iconExplanation)) {
    it(`ensures ${icon} exists`, () => {
      openLegende();
      cy.findByTestId(icon).should('be.visible');
    });
  }
});
