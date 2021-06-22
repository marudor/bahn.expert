export const manualNameOverrides: Map<string, string> = new Map();

// This should be fixed upstream, RIS::Stations
manualNameOverrides.set(
  'Weinheim (Bergstr) Hbf'.toLowerCase(),
  'Weinheim (Bergstr)',
);
