import {
  Explain,
  iconExplanation,
} from '@/client/Common/Components/CoachSequence/Explain';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '@/client/__tests__/testHelper';

describe('Explain', () => {
  function openLegende() {
    render(<Explain />);

    fireEvent.click(screen.getByTestId('coachSequenceLegendOpener'));
  }

  for (const icon of Object.keys(iconExplanation)) {
    it(`ensures ${icon} exists`, () => {
      openLegende();

      expect(screen.getByTestId(icon)).toBeInTheDocument();
    });
  }
});
