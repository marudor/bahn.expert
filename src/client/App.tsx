import Abfahrten from '@/client/Abfahrten';
import About from '@/client/Common/Components/About';
import DetailsRoute from '@/client/Common/Components/Details/DetailsRoute';
import { Navigation } from '@/client/Common/Components/Navigation';
import { CommonConfigProvider } from '@/client/Common/provider/CommonConfigProvider';
import { HeaderTagProvider } from '@/client/Common/provider/HeaderTagProvider';
import Regional from '@/client/Regional';
import Routing from '@/client/Routing';
import { RoutingProvider } from '@/client/Routing/provider/RoutingProvider';
import TrainRuns from '@/client/TrainRuns';
import { GlobalStyles } from '@mui/material';
import type { Theme } from '@mui/material';
import type { FC } from 'react';
import { Route, Routes } from 'react-router';

const globalStyles = (theme: Theme): any => ({
	body: {
		margin: 0,
		fontFamily: 'Roboto, sans-serif',
		backgroundColor: theme.vars.palette.background.default,
		color: theme.vars.palette.text.primary,
	},
	a: {
		textDecoration: 'none',
		color: theme.vars.palette.common.blue,
	},
	'html, body': {
		height: '100%',
	},
	'#app': {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	'.maplibregl-popup-content': {
		color: 'black',
	},
});

export const GlobalCSS: FC = () => <GlobalStyles styles={globalStyles} />;

export const App: FC = () => {
	return (
		<>
			<GlobalCSS />
			<HeaderTagProvider>
				<CommonConfigProvider>
					<Navigation>
						<RoutingProvider>
							<Routes>
								<Route path="/about" element={<About />} />
								{/* If you change this route also change hafasDetailsRedirect.ts */}
								<Route
									path="/details/:train/:initialDeparture/*"
									element={<DetailsRoute />}
								/>
								<Route path="/details/:train" element={<DetailsRoute />} />
								<Route path="/routing/*" element={<Routing />} />
								<Route path="/regional/*" element={<Regional />} />
								<Route path="/trainRuns/*" element={<TrainRuns />} />
								<Route path="/*" element={<Abfahrten />} />
							</Routes>
						</RoutingProvider>
					</Navigation>
				</CommonConfigProvider>
			</HeaderTagProvider>
		</>
	);
};
