import { ThemeWrap } from '@/client/ThemeWrap';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$')({
	component: IndexComponent,
});

function IndexComponent() {
	return <ThemeWrap />;
}
