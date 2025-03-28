import { elementUpdated, fixture } from '@open-wc/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { html } from 'lit';
import { W3mConnectingHeader } from '../../src/partials/w3m-connecting-header';
import { HelpersUtil } from '../utils/HelpersUtil';
const TABS = 'wui-tabs';
const TAB_VALUES = {
    mobile: {
        icon: 'mobile',
        label: 'Mobile',
        platform: 'mobile'
    },
    browser: {
        icon: 'extension',
        label: 'Browser',
        platform: 'browser'
    },
    desktop: {
        icon: 'desktop',
        label: 'Desktop',
        platform: 'desktop'
    }
};
async function createComponent(platformTabs) {
    const element = await fixture(html `<w3m-connecting-header .platforms=${platformTabs}></w3m-connecting-header>`);
    const { tabs } = HelpersUtil.querySelect(element, TABS);
    return { element, tabs };
}
describe('W3mConnectingHeader', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
    it('it should display different platforms', async () => {
        expect((await createComponent(['mobile'])).tabs).toStrictEqual([TAB_VALUES.mobile]);
        expect((await createComponent(['browser'])).tabs).toStrictEqual([TAB_VALUES.browser]);
        expect((await createComponent(['desktop'])).tabs).toStrictEqual([TAB_VALUES.desktop]);
    });
    it('it should activate the correct platform tab when clicked', async () => {
        const TABS = ['mobile', 'browser', 'desktop'];
        const { element } = await createComponent(TABS);
        const tabs = HelpersUtil.querySelect(element, 'wui-tabs');
        for (const platform of TABS) {
            HelpersUtil.getByTestId(tabs, `tab-${platform.toLowerCase()}`).click();
            element.requestUpdate();
            await elementUpdated(element);
            const tabElement = HelpersUtil.getByTestId(tabs, `tab-${platform.toLowerCase()}`);
            const isActive = tabElement.getAttribute('data-active') === 'true';
            expect(isActive).toBe(true);
        }
    });
});
//# sourceMappingURL=w3m-connecting-header.test.js.map