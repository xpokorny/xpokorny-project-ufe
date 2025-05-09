import { newE2EPage } from '@stencil/core/testing';

describe('xpokorny-ambulance-wl-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<xpokorny-ambulance-wl-editor></xpokorny-ambulance-wl-editor>');

    const element = await page.find('xpokorny-ambulance-wl-editor');
    expect(element).toHaveClass('hydrated');
  });
});
