import { newSpecPage } from '@stencil/core/testing';
import { XpokornyProjectWlList } from '../xpokorny-project-wl-list';

describe('xpokorny-project-wl-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XpokornyProjectWlList],
      html: `<xpokorny-project-wl-list></xpokorny-project-wl-list>`,
    });
    expect(page.root).toEqualHtml(`
      <xpokorny-project-wl-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </xpokorny-project-wl-list>
    `);
  });
});
