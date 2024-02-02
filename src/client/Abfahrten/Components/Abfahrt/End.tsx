import { Platform } from '@/client/Common/Components/Platform';
import { Stack } from '@mui/material';
import { Times } from './Times';
import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import type { FC } from 'react';

export const End: FC = () => {
  const { abfahrt } = useAbfahrt();
  return (
    <Stack
      data-testid="abfahrtEnd"
      alignItems="flex-end"
      direction="column"
      justifyContent="space-between"
      marginLeft={1}
      fontSize="2.5em"
    >
      <Times />
      <Platform
        real={abfahrt.platform}
        scheduled={abfahrt.scheduledPlatform}
        cancelled={abfahrt.cancelled}
      />
    </Stack>
  );
};
