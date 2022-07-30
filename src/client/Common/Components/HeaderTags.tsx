import { Helmet } from 'react-helmet-async';
import { useHeaderTags } from 'client/Common/provider/HeaderTagProvider';
import { useLocation } from 'react-router';
import type { FC, ReactNode } from 'react';

// types need to be updated by react-helmet-async to reflect implicit children change
declare module 'react-helmet-async' {
  export interface HelmetProps {
    children: ReactNode;
  }
  export interface ProviderProps {
    children: ReactNode;
  }
}

export const HeaderTags: FC = () => {
  const { title, description, keywords } = useHeaderTags();
  const url = `${globalThis.BASE_URL}${useLocation().pathname}`;
  const image = `${globalThis.BASE_URL}/android-chrome-384x384.png`;

  return (
    <Helmet>
      <title>{title}</title>
      <link data-testid="canonicalLink" rel="canonical" href={url} />
      <meta name="description" content={description} />
      <meta name="keywords" content={[...keywords].join(', ')} />
      {/* Twitter Start */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@marudor" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content="@marudor" />
      <meta name="twitter:image" content={image} />
      {/* Twitter End */}
      {/* Open Graph Start */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="de_DE" />
      {/* Open Graph End */}
    </Helmet>
  );
};
