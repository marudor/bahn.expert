import { AuslastungsDisplay } from '@/client/Common/Components/AuslastungsDisplay';
import { AuslastungsValue } from '@/types/routing';

const createAuslastung = (
	first: AuslastungsValue,
	second: AuslastungsValue,
) => ({
	first,
	second,
});
const iconTestId: Record<AuslastungsValue, string> = {
	[AuslastungsValue.Ausgebucht]: 'CloseIcon',
	[AuslastungsValue.SehrHoch]: 'ErrorOutlineIcon',
	[AuslastungsValue.Hoch]: 'WarningIcon',
	[AuslastungsValue.Gering]: 'DoneIcon',
};

function checkDisplay(first: AuslastungsValue, second: AuslastungsValue) {
	cy.mount(<AuslastungsDisplay auslastung={createAuslastung(first, second)} />);

	cy.findByTestId('first').within(() => {
		cy.findByTestId(iconTestId[first]).should('exist');
	});
	cy.findByTestId('second').within(() => {
		cy.findByTestId(iconTestId[second]).should('exist');
	});
}

describe('AuslastungsDisplay', () => {
	it('Gering / Hoch', () =>
		checkDisplay(AuslastungsValue.Gering, AuslastungsValue.Hoch));

	it('SehrHoch / Ausgebucht', () =>
		checkDisplay(AuslastungsValue.SehrHoch, AuslastungsValue.Ausgebucht));
});
