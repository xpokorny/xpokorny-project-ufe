import { newSpecPage } from '@stencil/core/testing';
import { XpokornyProjectWlList } from '../xpokorny-project-wl-list';

describe('xpokorny-project-wl-list', () => {
  it('renders', async () => {
    await newSpecPage({
      components: [XpokornyProjectWlList],
      html: `<xpokorny-project-wl-list></xpokorny-project-wl-list>`,
    });
  });
});