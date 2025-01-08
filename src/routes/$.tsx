import { LegacyApp } from '@/client/LegacyApp';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$')({
	component: LegacyApp,
});
