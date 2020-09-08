import { AuslastungsDisplay } from 'client/Common/Components/AuslastungsDisplay';
import { AuslastungsValue } from 'types/routing';
import { render } from 'client/__tests__/testHelper';

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
    const { container } = render(AuslastungsDisplay, {
      auslastung: {
        // @ts-expect-error just for test
        first: 'something',
        second: AuslastungsValue.Hoch,
      },
    });

    expect(container).toMatchSnapshot();
  });
});
