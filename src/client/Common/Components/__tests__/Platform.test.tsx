import { Platform } from '@/client/Common/Components/Platform';
import { render } from '@/client/__tests__/testHelper';
import { screen } from '@testing-library/react';

describe('Platform', () => {
  it('No platform provided', () => {
    const { container } = render(<Platform />);

    expect(screen.queryByTestId('real')).toBeEmptyDOMElement();
    expect(container).toMatchInlineSnapshot(`
<div
  class="emotion-0 emotion-1"
  data-testid="platform"
>
  <span
    data-testid="real"
  />
</div>
`);
  });
  it('scheduled === real', () => {
    const { container } = render(<Platform real="1" scheduled="1" />);

    expect(screen.queryByTestId('real')).toHaveTextContent('1');
    expect(screen.queryByTestId('scheduled')).toBeNull();
    expect(container).toMatchInlineSnapshot(`
<div
  class="emotion-0 emotion-1"
  data-testid="platform"
>
  <span
    data-testid="real"
  >
    1
  </span>
</div>
`);
  });
  it('scheduled === real & cancelled', () => {
    const { container } = render(<Platform real="1" scheduled="1" cancelled />);

    expect(screen.queryByTestId('real')).toHaveTextContent('1');
    expect(container).toHaveStyle('text-decoration: line-through');
    expect(container).toMatchInlineSnapshot(`
.emotion-0 {
  -webkit-text-decoration: line-through;
  text-decoration: line-through;
  text-decoration-color: #fff;
}

<div
  class="emotion-0 emotion-1"
  data-testid="platform"
>
  <span
    data-testid="real"
  >
    1
  </span>
</div>
`);
  });
  it('scheduled !== real & cancelled', () => {
    const { container, theme } = render(
      <Platform real="1" scheduled="2" cancelled />,
    );

    expect(screen.queryByTestId('real')).toHaveTextContent('1');
    expect(container).toHaveStyle(`
    text-decoration: line-through;
    color: ${theme.colors.red};`);
    expect(container).toMatchInlineSnapshot(`
.emotion-0 {
  -webkit-text-decoration: line-through;
  text-decoration: line-through;
  text-decoration-color: #fff;
  color: #ff1744!important;
}

.emotion-2 {
  -webkit-text-decoration: line-through;
  text-decoration: line-through;
  text-decoration-color: #fff;
  padding-left: .3em;
}

<div
  class="emotion-0 emotion-1"
  data-testid="platform"
>
  <span
    data-testid="real"
  >
    1
  </span>
  <span
    class="emotion-2 emotion-3"
    data-testid="scheduled"
  >
    (
    2
    )
  </span>
</div>
`);
  });
  it('scheduled !== real', () => {
    const { container, theme } = render(<Platform real="1" scheduled="2" />);

    expect(screen.queryByTestId('real')).toHaveTextContent('1');
    expect(screen.queryByTestId('scheduled')).toHaveTextContent('2');
    expect(screen.queryByTestId('scheduled')).toHaveStyle(
      'text-decoration: line-through;',
    );
    expect(container).not.toHaveStyle(`text-decoration: line-through;`);
    expect(container).toHaveStyle(`color: ${theme.colors.red};`);
    expect(container).toMatchInlineSnapshot(`
.emotion-0 {
  color: #ff1744!important;
}

.emotion-2 {
  -webkit-text-decoration: line-through;
  text-decoration: line-through;
  text-decoration-color: #fff;
  padding-left: .3em;
}

<div
  class="emotion-0 emotion-1"
  data-testid="platform"
>
  <span
    data-testid="real"
  >
    1
  </span>
  <span
    class="emotion-2 emotion-3"
    data-testid="scheduled"
  >
    (
    2
    )
  </span>
</div>
`);
  });
});
