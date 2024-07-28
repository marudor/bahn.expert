import { Loading } from '@/client/Common/Components/Loading';
import { Navigation } from '@/client/Common/Components/Navigation';
import { CoachSequenceProvider } from '@/client/Common/provider/CoachSequenceProvider';
import { CommonConfigProvider } from '@/client/Common/provider/CommonConfigProvider';
import { HeaderTagProvider } from '@/client/Common/provider/HeaderTagProvider';
import { RoutingProvider } from '@/client/Routing/provider/RoutingProvider';
import loadable from '@loadable/component';
import { GlobalStyles } from '@mui/material';
import type { Theme } from '@mui/material';
import type { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

const lazyOptions = {
	fallback: <Loading />,
};
const LazyRouting = loadable(() => import('./Routing'), lazyOptions);
const LazyDetails = loadable(
	() => import('./Common/Components/Details/DetailsRoute'),
	lazyOptions,
);
const LazyAbfahrten = loadable(() => import('./Abfahrten'), lazyOptions);
const LazyRegional = loadable(() => import('./Regional'), lazyOptions);
const About = loadable(() => import('./Common/Components/About'), lazyOptions);
const LazyTrainRuns = loadable(() => import('./TrainRuns'), lazyOptions);

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
});

export const GlobalCSS: FC = () => <GlobalStyles styles={globalStyles} />;

export const App: FC = () => {
	return (
		<>
			<GlobalCSS />
			<HeaderTagProvider>
				<CommonConfigProvider>
					<Navigation>
						<CoachSequenceProvider>
							<RoutingProvider>
								<Routes>
									<Route path="/about" element={<About />} />
									{/* If you change this route also change hafasDetailsRedirect.ts */}
									<Route
										path="/details/:train/:initialDeparture/*"
										element={<LazyDetails />}
									/>
									<Route path="/details/:train" element={<LazyDetails />} />
									<Route path="/routing/*" element={<LazyRouting />} />
									<Route path="/regional/*" element={<LazyRegional />} />
									<Route path="/trainRuns/*" element={<LazyTrainRuns />} />
									<Route path="/*" element={<LazyAbfahrten />} />
								</Routes>
							</RoutingProvider>
						</CoachSequenceProvider>
					</Navigation>
				</CommonConfigProvider>
			</HeaderTagProvider>
		</>
	);
};
