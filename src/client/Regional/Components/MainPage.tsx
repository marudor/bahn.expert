import { FavEntryDisplay } from '@/client/Abfahrten/Components/FavEntry';
import { FavList } from '@/client/Abfahrten/Components/FavList';
import type { FC } from 'react';

interface Props {}

export const RegionalMainPage: FC<Props> = () => (
	<>
		<FavList>
			<FavEntryDisplay nonClickable text="Nahverkehr Abfahrten" />
		</FavList>
	</>
);
