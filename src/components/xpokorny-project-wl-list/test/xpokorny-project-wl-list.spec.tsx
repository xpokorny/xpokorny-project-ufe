import { newSpecPage } from '@stencil/core/testing';
import { XpokornyProjectWlList } from '../xpokorny-project-wl-list';

describe('xpokorny-project-wl-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [XpokornyProjectWlList],
      html: `<xpokorny-project-wl-list></xpokorny-project-wl-list>`,
    });

    const wlList = page.rootInstance as XpokornyProjectWlList;
    const expectedReservations = wlList?.myReservations?.length

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");
    expect(items.length).toEqual(expectedReservations);
  });
});
