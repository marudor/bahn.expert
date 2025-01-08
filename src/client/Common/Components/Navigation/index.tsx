import { SettingsModal } from '@/client/Common/Components/SettingsModal';
import { Zugsuche } from '@/client/Common/Components/Zugsuche';
import { useSetCommonConfigOpen } from '@/client/Common/provider/CommonConfigProvider';
import { Disruption } from '@/client/DisruptionBanner';
import { PolitikBanner } from '@/client/PolitikBanner';
import AlarmOnOutlined from '@mui/icons-material/AlarmOnOutlined';
import Explore from '@mui/icons-material/Explore';
import Info from '@mui/icons-material/Info';
import Search from '@mui/icons-material/Search';
import Settings from '@mui/icons-material/Settings';
import Train from '@mui/icons-material/Train';
import {
	Drawer,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	NoSsr,
	styled,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { Link } from 'react-router';
import { NavigationContext } from './NavigationContext';
import { ThemeSelection } from './ThemeSelection';

const Headline = styled('h3')`
  text-align: center;
`;

const DrawerContent = styled(List)`
  width: 230px;
  overflow-x: hidden;
  & a {
    color: inherit;
  }
  & .MuiListItem-button {
    padding: 20px 20px;
  }
`;

interface Props {
	children: ReactNode;
}

export const Navigation: FC<Props> = ({ children }) => {
	const setConfigOpen = useSetCommonConfigOpen();
	const [open, setOpen] = useState(false);
	const toggleDrawer = useCallback(() => {
		setOpen((old) => !old);
	}, []);
	const navigationContext = useMemo(
		() => ({
			toggleDrawer,
		}),
		[toggleDrawer],
	);

	const openSettingsCb = useCallback(() => {
		setConfigOpen(true);
	}, [setConfigOpen]);

	return (
		<>
			<NoSsr>
				<Disruption />
				<PolitikBanner />
			</NoSsr>
			<SettingsModal />
			<NavigationContext.Provider value={navigationContext}>
				<Drawer open={open} onClose={toggleDrawer}>
					<Headline>Bahn Experte</Headline>
					<DrawerContent onClick={toggleDrawer}>
						<Link to="/">
							<ListItemButton>
								<ListItemIcon>
									<AlarmOnOutlined />
								</ListItemIcon>
								<ListItemText primary="Abfahrten" />
							</ListItemButton>
						</Link>
						<Link to="/routing">
							<ListItemButton>
								<ListItemIcon>
									<Explore />
								</ListItemIcon>
								<ListItemText primary="Routing" />
							</ListItemButton>
						</Link>
						<Zugsuche>
							{(toggle) => (
								<ListItemButton onClick={toggle}>
									<ListItemIcon>
										<Search />
									</ListItemIcon>
									<ListItemText primary="Zugsuche" />
								</ListItemButton>
							)}
						</Zugsuche>
						<Link to="/trainRuns">
							<ListItemButton>
								<ListItemIcon>
									<Train />
								</ListItemIcon>
								<ListItemText primary="Zugläufe" />
							</ListItemButton>
						</Link>
						<ListItemButton data-testid="openSettings" onClick={openSettingsCb}>
							<ListItemIcon>
								<Settings />
							</ListItemIcon>
							<ListItemText primary="Einstellungen" />
						</ListItemButton>
						<ThemeSelection />
						<Link to="/about">
							<ListItemButton>
								<ListItemIcon>
									<Info />
								</ListItemIcon>
								<ListItemText primary="About" />
							</ListItemButton>
						</Link>
					</DrawerContent>
				</Drawer>
				{children}
			</NavigationContext.Provider>
		</>
	);
};
