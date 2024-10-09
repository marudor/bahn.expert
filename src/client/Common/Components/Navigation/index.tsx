import { SettingsModal } from '@/client/Common/Components/SettingsModal';
import { Zugsuche } from '@/client/Common/Components/Zugsuche';
import { useSetCommonConfigOpen } from '@/client/Common/provider/CommonConfigProvider';
import { PolitikBanner } from '@/client/PolitikBanner';
import { Info, Search, Settings } from '@mui/icons-material';
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
import { Link } from 'react-router-dom';
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
				<PolitikBanner />
			</NoSsr>
			<SettingsModal />
			<NavigationContext.Provider value={navigationContext}>
				<Drawer open={open} onClose={toggleDrawer}>
					<Headline>Bahn Experte</Headline>
					<DrawerContent onClick={toggleDrawer}>
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
