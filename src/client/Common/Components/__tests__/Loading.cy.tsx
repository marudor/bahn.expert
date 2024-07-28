import { Loading, LoadingType } from '@/client/Common/Components/Loading';
import type { FC, ReactNode } from 'react';

interface DummyProps {
	content?: ReactNode;
}
const DummyComponent: FC<DummyProps> = ({ content }) => (
	<div data-testid="dummy">{content}</div>
);

describe('Loading', () => {
	it('shows loading if no children given', () => {
		cy.mount(<Loading />);
		cy.findByTestId('grid').should('be.visible');
	});

	it('shows loading if no children given (dots type)', () => {
		cy.mount(<Loading type={LoadingType.dots} />);
		cy.findByTestId('dots').should('be.visible');
	});

	it('supports custom className', () => {
		cy.mount(<Loading className="test" />);
		cy.findByTestId('loading').should('have.class', 'test');
		cy.findByTestId('grid').should('be.visible');
	});

	it('shows children if check is true', () => {
		cy.mount(<Loading check>{() => <DummyComponent />}</Loading>);
		cy.findByTestId('loading').should('not.exist');
		cy.findByTestId('dummy').should('exist');
	});

	it('calls children with check variable', () => {
		cy.mount(
			<Loading check="content">
				{(content) => <DummyComponent content={content} />}
			</Loading>,
		);
		cy.findByTestId('dummy').should('have.text', 'content');
	});
});
