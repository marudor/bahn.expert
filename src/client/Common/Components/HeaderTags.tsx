import { useHeaderTags } from '@/client/Common/provider/HeaderTagProvider';
import type { FC } from 'react';
import { Link, Meta, Title } from 'react-head';
import { useLocation } from 'react-router';

export const HeaderTags: FC = () => {
	const { title, description, keywords } = useHeaderTags();
	const url = `${globalThis.BASE_URL}${useLocation().pathname}`;
	const image = `${globalThis.BASE_URL}/android-chrome-384x384.png`;

	return (
		<>
			<Title>{title}</Title>
			<Link data-testid="canonicalLink" rel="canonical" href={url} />
			<Meta name="description" content={description} />
			<Meta name="keywords" content={[...keywords].join(', ')} />
			{/* Twitter Start */}
			<Meta name="twitter:card" content="summary" />
			<Meta name="twitter:site" content="@marudor" />
			<Meta name="twitter:title" content={title} />
			<Meta name="twitter:description" content={description} />
			<Meta name="twitter:creator" content="@marudor" />
			<Meta name="twitter:image" content={image} />
			{/* Twitter End */}
			{/* Open Graph Start */}
			<Meta property="og:title" content={title} />
			<Meta property="og:type" content="website" />
			<Meta property="og:description" content={description} />
			<Meta property="og:image" content={image} />
			<Meta property="og:url" content={url} />
			<Meta property="og:locale" content="de_DE" />
			{/* Open Graph End */}
		</>
	);
};
