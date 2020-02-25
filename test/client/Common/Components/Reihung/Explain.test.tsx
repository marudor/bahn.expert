import { fireEvent } from '@testing-library/react';
import { render } from 'testHelper';
import Explain, { iconExplanation } from 'Common/Components/Reihung/Explain';

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

  Object.keys(iconExplanation).forEach(icon => {
    it(`ensures ${icon} exists`, () => {
      const { getByTestId } = openLegende();

      expect(getByTestId(icon)).toBeInTheDocument();
    });
  });
});
