import { AbfahrtenList } from '@/client/Abfahrten/Components/AbfahrtenList';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/_abfahrten/$stopPlace')({
	validateSearch: z.object({
		filter: z.string().optional(),
	}),
	component: AbfahrtenList,
});
