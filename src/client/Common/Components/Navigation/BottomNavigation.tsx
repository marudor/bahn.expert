import { AlarmAddOutlined, Explore, Train } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { type FC, type SyntheticEvent, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const BottomNav: FC = () => {
	const location = useLocation().pathname;
	const [value, setValue] = useState(location);

	const handleChange = (_: SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	return (
		<Paper css={{ position: 'fixed', bottom: 0, width: '100%' }}>
			<BottomNavigation
				showLabels
				value={value}
				onChange={handleChange}
				style={{ padding: '5px 0' }}
			>
				<BottomNavigationAction
					label="Abfahrten"
					value="/"
					icon={<AlarmAddOutlined />}
					component={Link}
					to="/"
				/>
				<BottomNavigationAction
					style={{ textAlign: 'center' }}
					label="Nahverkehr Abfahrten"
					value="/regional"
					icon={<AlarmAddOutlined />}
					component={Link}
					to="/regional"
					data-testid="regional"
				/>
				<BottomNavigationAction
					label="Routing"
					value="/routing"
					icon={<Explore />}
					component={Link}
					to="/routing"
				/>
				<BottomNavigationAction
					label="Zugläufe"
					value="/trainRuns"
					icon={<Train />}
					component={Link}
					to="/trainRuns"
				/>
			</BottomNavigation>
		</Paper>
	);
};
