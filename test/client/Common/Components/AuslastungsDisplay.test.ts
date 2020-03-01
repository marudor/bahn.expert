import { AuslastungsValue } from 'types/routing';
import { render } from 'testHelper';
import AuslastungsDisplay from 'Common/Components/AuslastungsDisplay';

describe('AuslastungsDisplay', () => {
  it('Gering / Hoch', () => {
    const { container } = render(AuslastungsDisplay, {
      auslastung: {
        first: AuslastungsValue.Gering,
        second: AuslastungsValue.Hoch,
      },
    });

    expect(container).toMatchSnapshot();
  });

  it('SehrHoch / Ausgebucht', () => {
    const { container } = render(AuslastungsDisplay, {
      auslastung: {
        first: AuslastungsValue.SehrHoch,
        second: AuslastungsValue.Ausgebucht,
      },
    });

    expect(container).toMatchSnapshot();
  });

  it('Unbekannt / Hoch', () => {
    // @ts-ignore
    const { container } = render(AuslastungsDisplay, {
      auslastung: {
        // @ts-ignore
        first: 'something',
        second: AuslastungsValue.Hoch,
      },
    });

    expect(container).toMatchSnapshot();
  });
});
