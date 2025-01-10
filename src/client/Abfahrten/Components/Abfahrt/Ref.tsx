import { useAbfahrt } from '@/client/Abfahrten/provider/AbfahrtProvider';
import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import type { SubstituteRef } from '@/types/iris';
import { styled } from '@mui/material';

const Text = styled('span')`
  font-size: 0.7em;
`;
const StyledDetailsLink = Text.withComponent(DetailsLink);
interface Props {
	reference: SubstituteRef;
	className?: string;
}

export const Ref: FCC<Props> = ({ reference, children, className }) => {
	const { abfahrt } = useAbfahrt();
	return (
		<>
			<Text className={className}>{children}</Text>
			<StyledDetailsLink
				className={className}
				train={reference}
				evaNumberAlongRoute={abfahrt.currentStopPlace.evaNumber}
				initialDeparture={abfahrt.initialDeparture}
			>
				{reference.name}
			</StyledDetailsLink>
		</>
	);
};
