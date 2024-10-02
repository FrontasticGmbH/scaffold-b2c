import { render, screen } from '__test__/utils';
import Breadcrumb from '.';

describe('[Component] Breacrumb', () => {
  it('Renders correctly', () => {
    render(
      <Breadcrumb>
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </Breadcrumb>,
    );

    expect(screen.queryByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('list').textContent).toBe('1/2/3');
  });

  it('Renders custom Separator correctly', () => {
    render(
      <Breadcrumb Separator="->">
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </Breadcrumb>,
    );

    expect(screen.getByRole('list').textContent).toBe('1->2->3');
  });
});
