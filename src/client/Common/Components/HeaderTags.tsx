import { useHeaderTags } from '@/client/Common/provider/HeaderTagProvider';
import type { FC } from 'react';
import { Meta, Title } from 'react-head';
import { useLocation } from 'react-router';

export const HeaderTags: FC = () => {
	const { title, description, keywords } = useHeaderTags();
	const url = `${globalThis.BASE_URL}${useLocation().pathname}`;

	return (
		<>
			<Title>{title}</Title>
			<Meta name="description" content={description} />
			<Meta name="keywords" content={[...keywords].join(', ')} />
			{/* Open Graph Start - rest in __root.tsx */}
			<Meta property="og:title" content={title} />
			<Meta property="og:description" content={description} />
			{/* Open Graph End */}
		</>
	);
};
