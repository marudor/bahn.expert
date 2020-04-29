import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import HeaderTagContainer from 'Common/container/HeaderTagContainer';

const HeaderTags = () => {
  const { title, description } = HeaderTagContainer.useContainer();
  const url = `https://${global.baseUrl}${useLocation().pathname}`;
  const image = `https://${global.baseUrl}/android-chrome-384x384.png`;

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta name="description" content={description} />
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

export default HeaderTags;
