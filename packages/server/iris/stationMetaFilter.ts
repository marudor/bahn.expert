export const stationMetaFilter: {
  [key: string]: string[] | undefined;
} = {
  // Norddeich excludes Norddeich Mole & Norddeich Flugplatz
  '8004449': ['8007768', '8070178'],
  // Norddeich Flugplatz excludes Norddeich
  '8070178': ['8004449'],
  // Norddeich Mole excludes Norddeich
  '8007768': ['8004449'],
};
