import { AuslastungsValue } from 'types/routing';
import { render } from 'testHelper';
import AuslastungsDisplay from 'Common/Components/AuslastungsDisplay';

describe('AuslastungsDisplay', () => {
  it('Gering / Hoch', () => {
    const { getByTestId, container } = render(AuslastungsDisplay, {
      auslastung: {
        first: AuslastungsValue.Gering,
        second: AuslastungsValue.Hoch,
      },
    });

    expect(getByTestId('first').children[1].getAttribute('title')).toBe(
      'Geringe Auslastung'
    );
    expect(getByTestId('second').children[1].getAttribute('title')).toBe(
      'Mittlere Auslastung'
    );
    expect(container).toMatchSnapshot();
  });

  it('SehrHoch / Ausgebucht', () => {
    const { getByTestId, container } = render(AuslastungsDisplay, {
      auslastung: {
        first: AuslastungsValue.SehrHoch,
        second: AuslastungsValue.Ausgebucht,
      },
    });

    expect(getByTestId('first').children[1].getAttribute('title')).toBe(
      'Hohe Auslastung'
    );
    expect(getByTestId('second').children[1].getAttribute('title')).toBe(
      'Ausgebucht'
    );
    expect(container).toMatchSnapshot();
  });

  it('Unbekannt / Hoch', () => {
    // @ts-ignore
    const { getByTestId, container } = render(AuslastungsDisplay, {
      auslastung: {
        first: 'something',
        second: AuslastungsValue.Hoch,
      },
    });

    expect(getByTestId('first').children[1].getAttribute('title')).toBe(
      'Unbekannt'
    );
    expect(getByTestId('second').children[1].getAttribute('title')).toBe(
      'Mittlere Auslastung'
    );
    expect(container).toMatchSnapshot();
  });
});
