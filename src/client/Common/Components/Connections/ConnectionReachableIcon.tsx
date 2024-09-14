import { SingleAuslastungsDisplay } from '@/client/Common/Components/SingleAuslastungsDisplay';
import type {
	ConnectionEvaluationLegacy,
	ConnectionStatus,
} from '@/external/generated/risConnections';
import { AuslastungsValue } from '@/types/routing';
import { Tooltip } from '@mui/material';
import { type FC, useMemo } from 'react';

interface Props {
	connectionStatusByPersona: ConnectionEvaluationLegacy[];
}

function getDataForStatus(
	status?: ConnectionStatus,
): [string, AuslastungsValue | undefined] {
	switch (status) {
		case 'IMPOSSIBLE':
			return ['Wird nicht erreicht', AuslastungsValue.Ausgebucht];
		case 'CRITICAL':
			return ['Kritisch, beschleunigt umsteigen', AuslastungsValue.SehrHoch];
		case 'SAFE':
			return ['Sicher', AuslastungsValue.Gering];
		default:
			return ['Unbekannt', undefined];
	}
}

export const ConnectionReachableIcon: FC<Props> = ({
	connectionStatusByPersona,
}) => {
	const relevantPersona = connectionStatusByPersona.find(
		(p) => p.persona === 'OCCASIONAL_TRAVELLER',
	);
	const [tooltipTitle, auslastung] = useMemo(
		() => getDataForStatus(relevantPersona?.status),
		[relevantPersona],
	);
	if (!relevantPersona) {
		return null;
	}
	return (
		<Tooltip title={tooltipTitle}>
			<SingleAuslastungsDisplay auslastung={auslastung} />
		</Tooltip>
	);
};
