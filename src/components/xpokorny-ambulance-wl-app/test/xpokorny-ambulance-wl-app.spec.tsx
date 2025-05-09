import { newSpecPage } from '@stencil/core/testing';
import { XpokornyAmbulanceWlApp } from '../xpokorny-ambulance-wl-app';

describe('xpokorny-ambulance-wl-app', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XpokornyAmbulanceWlApp],
      html: `<xpokorny-ambulance-wl-app></xpokorny-ambulance-wl-app>`,
    });
    expect(page.root).toEqualHtml(`
      <xpokorny-ambulance-wl-app>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </xpokorny-ambulance-wl-app>
    `);
  });
});
