import {
  Explain,
  iconExplanation,
} from 'client/Common/Components/Reihung/Explain';
import { fireEvent, screen } from '@testing-library/react';
import { render } from 'client/__tests__/testHelper';

describe('Explain', () => {
  function openLegende() {
    render(Explain);

    fireEvent.click(screen.getByTestId('reihungLegendOpener'));
  }

  Object.keys(iconExplanation).forEach((icon) => {
    it(`ensures ${icon} exists`, () => {
      openLegende();

      expect(screen.getByTestId(icon)).toBeInTheDocument();
    });
  });
});
