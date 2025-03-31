import { newE2EPage } from '@stencil/core/testing';

describe('xpokorny-project-wl-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xpokorny-project-wl-list></xpokorny-project-wl-list>');

    const element = await page.find('xpokorny-project-wl-list');
    expect(element).toHaveClass('hydrated');
  });
});
