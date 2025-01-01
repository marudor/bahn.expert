import { SingleAuslastungsDisplay } from '@/client/Common/Components/SingleAuslastungsDisplay';
import type {
	CoachSequenceCoach,
	CoachSequenceCoachFeatures,
} from '@/types/coachSequence';
import AcUnit from '@mui/icons-material/AcUnit.js';
import Accessibility from '@mui/icons-material/Accessibility.js';
import Accessible from '@mui/icons-material/Accessible.js';
import ChildCare from '@mui/icons-material/ChildCare.js';
import ChildFriendly from '@mui/icons-material/ChildFriendly.js';
import InfoOutlined from '@mui/icons-material/InfoOutlined.js';
import LocalDining from '@mui/icons-material/LocalDining.js';
import NotificationsOff from '@mui/icons-material/NotificationsOff.js';
import PedalBike from '@mui/icons-material/PedalBike.js';
import SignalCellular4Bar from '@mui/icons-material/SignalCellular4Bar.js';
import Stroller from '@mui/icons-material/Stroller.js';
import WcOutlined from '@mui/icons-material/WcOutlined.js';
import WifiOutlined from '@mui/icons-material/WifiOutlined.js';
import { styled } from '@mui/material';
import { type ComponentType, type FC, useMemo } from 'react';
import { SitzplatzInfo } from './SitzplatzInfo';
import { UIC } from './UIC';
import { WagenLink } from './WagenLink';

const DummyIcon = styled('span')(({ theme }) => ({
	width: '.6em',
	height: '.6em',
	[theme.breakpoints.down('md')]: {
		fontSize: 16,
	},
}));

export const icons: {
	[key in keyof Required<CoachSequenceCoachFeatures>]: ComponentType | null;
} = {
	wheelchair: DummyIcon.withComponent(Accessible),
	bike: DummyIcon.withComponent(PedalBike),
	multiPurpose: DummyIcon.withComponent(Stroller),
	dining: DummyIcon.withComponent(LocalDining),
	quiet: DummyIcon.withComponent(NotificationsOff),
	toddler: DummyIcon.withComponent(ChildFriendly),
	family: DummyIcon.withComponent(ChildCare),
	disabled: DummyIcon.withComponent(Accessibility),
	info: DummyIcon.withComponent(InfoOutlined),
	wifi: DummyIcon.withComponent(WifiOutlined),
	comfort: null,
	airConditioning: DummyIcon.withComponent(AcUnit),
	boardingAid: DummyIcon.withComponent(SignalCellular4Bar),
	// currently mainly wheelchair accessible toilets are known I can't really seperate them yet
	toiletWheelchair: DummyIcon.withComponent(WcOutlined),
	toilet: DummyIcon.withComponent(WcOutlined),
};

const Container = styled('div')<{
	wrongWing?: boolean;
	closed?: boolean;
}>(
	({ theme }) => ({
		position: 'absolute',
		height: '2.5em',
		border: `${theme.vars.palette.text.primary} 1px solid`,
		boxSizing: 'border-box',
	}),
	{
		variants: [
			{
				props: { closed: true },
				style: ({ theme }) => ({
					background: `repeating-linear-gradient(135deg, ${theme.vars.palette.common.shadedBackground}, ${theme.vars.palette.common.shadedBackground}, 5px, transparent 5px, transparent 10px)`,
				}),
			},
			{
				props: { wrongWing: true },
				style: ({ theme }) => ({
					background: theme.vars.palette.common.shadedBackground,
					'&::after': {
						content: '""',
						top: -1,
						left: -1,
						right: -1,
						bottom: '-3.7em',
						pointerEvents: 'none',
						zIndex: 5,
						background: theme.vars.palette.common.transparentBackground,
					},
				}),
			},
		],
	},
);

const DoppelstockIndicator = styled('span')(({ theme }) => ({
	position: 'absolute',
	height: '1px',
	top: '45%',
	left: 0,
	right: 0,
	backgroundImage: `linear-gradient(to right, ${theme.vars.palette.text.primary} 33%, transparent 0%)`,
	backgroundSize: '8px 1px',
	backgroundRepeat: 'repeat-x',
}));

const Fahrzeugklasse = styled('span')<{
	coachClass: CoachSequenceCoach['class'];
}>(
	{
		bottom: 0,
		right: 0,
		position: 'absolute',
	},
	{
		variants: [
			{
				props: { coachClass: 1 },
				style: ({ theme }) => ({
					backgroundColor: theme.vars.palette.common.yellow,
					color: theme.palette.getContrastText(theme.palette.common.yellow),
					'&::after': {
						content: '"1"',
					},
				}),
			},
			{
				props: { coachClass: 2 },
				style: ({ theme }) => ({
					backgroundColor: theme.vars.palette.common.red,
					color: theme.palette.getContrastText(theme.palette.common.red),
					'&::after': {
						content: '"2"',
					},
				}),
			},
			{
				props: { coachClass: 3 },
				style: ({ theme }) => ({
					background: `linear-gradient(to right, ${theme.vars.palette.common.yellow}, ${theme.vars.palette.common.red})`,
					'&::after': {
						content: '"1/2"',
					},
				}),
			},
			{
				props: { coachClass: 4 },
				style: {
					right: '50%',
					transform: 'translateX(50%)',
					'&::after': {
						content: '"LOK"',
					},
				},
			},
		],
	},
);

const IdentificationNumber = styled('span')`
  position: absolute;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
`;

const ComfortIcon = styled('span')(({ theme }) => ({
	position: 'absolute',
	top: '.2em',
	right: '.3em',
	width: '.7em',
	height: '.7em',
	backgroundColor: theme.vars.palette.common.red,
	borderRadius: '50%',
}));

const ExtraInfoContainer = styled('span')<{ showCoachType: boolean }>(
	{
		position: 'absolute',
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		alignItems: 'center',
	},
	{
		variants: [
			{
				props: { showCoachType: true },
				style: {
					top: '150%',
				},
			},
			{
				props: { showCoachType: false },
				style: {
					top: '100%',
				},
			},
		],
	},
);

const PositionedSingleAuslastungsDisplay = styled(SingleAuslastungsDisplay)`
  position: absolute;
  left: 0;
  bottom: 0;
`;

export interface InheritedProps {
	scale: number;
	correctLeft: number;
	reverse: boolean;
}

export interface Props extends InheritedProps {
	fahrzeug: CoachSequenceCoach;
	destination?: string;
	wrongWing?: boolean;
	showUIC: boolean;
	showCoachType: boolean;
	Stripe?: FC;
	'data-testid'?: string;
}

export const Coach: FC<Props> = ({
	fahrzeug,
	wrongWing,
	scale,
	correctLeft,
	showUIC,
	showCoachType,
	reverse,
	Stripe,
}) => {
	const { startPercent, endPercent } = fahrzeug.position;

	const position = useMemo(() => {
		const cssName = reverse ? 'right' : 'left';
		return {
			[cssName]: `${(startPercent - correctLeft) * scale}%`,
			width: `${(endPercent - startPercent) * scale}%`,
		};
	}, [reverse, startPercent, correctLeft, scale, endPercent]);

	return (
		<Container
			wrongWing={wrongWing && !fahrzeug.closed}
			closed={fahrzeug.closed}
			data-testid={`coachSequenceCoach${fahrzeug.identificationNumber}`}
			style={position}
		>
			{Stripe && <Stripe />}
			{fahrzeug.vehicleCategory.includes('DOUBLEDECK') && (
				<DoppelstockIndicator />
			)}
			<Fahrzeugklasse coachClass={fahrzeug.class} />
			{fahrzeug.occupancy && (
				<PositionedSingleAuslastungsDisplay auslastung={fahrzeug.occupancy} />
			)}
			{fahrzeug.identificationNumber && (
				<IdentificationNumber>
					{fahrzeug.identificationNumber}
				</IdentificationNumber>
			)}
			<span>
				{Object.entries(fahrzeug.features)
					.sort()
					.map(([key, enabled]) => {
						if (enabled) {
							// @ts-expect-error this is correct, it's exact!
							const SpecificIcon = icons[key];
							if (!SpecificIcon) return null;
							return <SpecificIcon key={key} />;
						}

						return null;
					})}
			</span>
			{fahrzeug.features.comfort && <ComfortIcon />}
			{showCoachType && <WagenLink fahrzeug={fahrzeug} />}
			<ExtraInfoContainer showCoachType={showCoachType}>
				{showUIC && <UIC uic={fahrzeug.uic} />}
				<SitzplatzInfo
					identificationNumber={fahrzeug.identificationNumber}
					seats={fahrzeug.seats}
				/>
			</ExtraInfoContainer>
		</Container>
	);
};
