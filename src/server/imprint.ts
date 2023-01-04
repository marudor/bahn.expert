import { checkSecrets } from 'server/checkSecret';

export const imprint = {
  name: process.env.IMPRINT_NAME!,
  street: process.env.IMPRINT_STREET!,
  town: process.env.IMPRINT_TOWN!,
};

checkSecrets(
  process.env.IMPRINT_NAME,
  process.env.IMPRINT_STREET,
  process.env.IMPRINT_TOWN,
);
