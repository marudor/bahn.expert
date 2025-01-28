import { useHeaderTags } from '@/client/Common/provider/HeaderTagProvider';
import type { FC } from 'react';
import { Meta } from 'react-head';

export const HeaderTags: FC = () => {
	const { title, description, keywords } = useHeaderTags();

	return (
		<>
			<title>{title}</title>
			<Meta name="description" content={description} />
			<Meta name="keywords" content={[...keywords].join(', ')} />
			{/* Open Graph Start - rest in __root.tsx */}
			<Meta property="og:title" content={title} />
			<Meta property="og:description" content={description} />
			{/* Open Graph End */}
		</>
	);
};
