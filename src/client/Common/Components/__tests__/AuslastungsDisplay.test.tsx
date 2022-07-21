import { AuslastungsDisplay } from 'client/Common/Components/AuslastungsDisplay';
import { AuslastungsValue } from 'types/routing';
import { render } from 'client/__tests__/testHelper';

const createAuslastung = (
  first: AuslastungsValue,
  second: AuslastungsValue,
) => ({
  first,
  second,
});

describe('AuslastungsDisplay', () => {
  it('Gering / Hoch', () => {
    const { container } = render(
      <AuslastungsDisplay
        auslastung={createAuslastung(
          AuslastungsValue.Gering,
          AuslastungsValue.Hoch,
        )}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('SehrHoch / Ausgebucht', () => {
    const { container } = render(
      <AuslastungsDisplay
        auslastung={createAuslastung(
          AuslastungsValue.SehrHoch,
          AuslastungsValue.Ausgebucht,
        )}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('Unbekannt / Hoch', () => {
    const { container } = render(
      <AuslastungsDisplay
        // @ts-expect-error wrong type for test only
        auslastung={createAuslastung('something', AuslastungsValue.Hoch)}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
