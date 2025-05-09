import { newE2EPage } from '@stencil/core/testing';

describe('xpokorny-ambulance-wl-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xpokorny-ambulance-wl-app></xpokorny-ambulance-wl-app>');

    const element = await page.find('xpokorny-ambulance-wl-app');
    expect(element).toHaveClass('hydrated');
  });
});
