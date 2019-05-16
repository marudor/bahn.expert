import { Helmet } from 'react-helmet';
import { Station } from 'types/station';
import React from 'react';

interface Props {
  currentStation?: Station;
  baseUrl: string;
}
const MetaTags = ({ currentStation, baseUrl }: Props) => {
  let title = 'Bahnhofsabfahrten';
  let ogDescription =
    'Zugabfahrten für Stationen der Deutsche Bahn. Nutzt verschiedene Quellen um möglichst genaue Informationen bereitzustellen. Nutzt teilweise offizielle, teilweise inoffizielle Quellen.';
  let description = ogDescription;
  let url = `https://${baseUrl}`;
  const image = `https://${baseUrl}/android-chrome-384x384.png`;

  if (currentStation) {
    title = `${currentStation.title} - ${title}`;
    description = `Zugabfahrten für ${currentStation.title}`;
    ogDescription = description;
    url += `/${encodeURIComponent(currentStation.title)}`;
  }

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta name="description" content={description} />
      {/* Twitter Start */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@marudor" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:creator" content="@marudor" />
      <meta name="twitter:image" content={image} />
      {/* Twitter End */}
      {/* Open Graph Start */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="de_DE" />
      {/* Open Graph End */}
    </Helmet>
  );
};

export default MetaTags;
