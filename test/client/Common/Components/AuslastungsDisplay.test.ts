import { AuslastungsValue } from 'types/routing';
import { createStore } from '../../store';
import { render } from '../../renderHelper';
import AuslastungsDisplay from 'Common/Components/AuslastungsDisplay';

describe('AuslastungsDisplay', () => {
  createStore();

  it('Gering / Hoch', () => {
    const { getByTestId } = render(AuslastungsDisplay, {
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
  });

  it('SehrHoch / Ausgebucht', () => {
    const { getByTestId } = render(AuslastungsDisplay, {
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
  });

  it('Unbekannt / Hoch', () => {
    // @ts-ignore
    const { getByTestId } = render(AuslastungsDisplay, {
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
  });
});
