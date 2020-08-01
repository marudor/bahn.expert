import {
  Explain,
  iconExplanation,
} from 'client/Common/Components/Reihung/Explain';
import { fireEvent } from '@testing-library/react';
import { render } from 'client/__tests__/testHelper';

describe('Explain', () => {
  function openLegende() {
    const renderResult = render(Explain);

    fireEvent.click(renderResult.getByTestId('reihungLegendOpener'));

    return renderResult;
  }
  it('ensures BahnComfort exists', () => {
    const { getByTestId } = openLegende();

    expect(getByTestId('bahnComfort')).toBeInTheDocument();
  });

  Object.keys(iconExplanation).forEach((icon) => {
    it(`ensures ${icon} exists`, () => {
      const { getByTestId } = openLegende();

      expect(getByTestId(icon)).toBeInTheDocument();
    });
  });
});
