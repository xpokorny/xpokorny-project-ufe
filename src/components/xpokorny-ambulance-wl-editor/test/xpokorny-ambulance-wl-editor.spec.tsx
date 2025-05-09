import { newSpecPage } from '@stencil/core/testing';
import { XpokornyAmbulanceWlEditor } from '../xpokorny-ambulance-wl-editor';

describe('xpokorny-ambulance-wl-editor', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XpokornyAmbulanceWlEditor],
      html: `<xpokorny-ambulance-wl-editor></xpokorny-ambulance-wl-editor>`,
    });
    expect(page.root).toEqualHtml(`
      <xpokorny-ambulance-wl-editor>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </xpokorny-ambulance-wl-editor>
    `);
  });
});
