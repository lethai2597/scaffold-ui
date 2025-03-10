import { fixture } from '@open-wc/testing';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { html } from 'lit';
import { ConstantsUtil } from '@reown/appkit-common';
import { ChainController, ConnectorController, CoreHelperUtil, OptionsController } from '@reown/appkit-core';
import { W3mConnectView } from '../../src/views/w3m-connect-view/index';
import { HelpersUtil } from '../utils/HelpersUtil';
const EMAIL_LOGIN_WIDGET = 'w3m-email-login-widget';
const SOCIAL_LOGIN_WIDGET = 'w3m-social-login-widget';
const WALLET_LOGIN_LIST = 'w3m-wallet-login-list';
const COLLAPSE_WALLETS_BUTTON = 'w3m-collapse-wallets-button';
const SEPARATOR = 'wui-separator';
const EMAIL_SEPARATOR = 'w3m-email-login-or-separator';
const INSTALLED_WALLET = {
    id: 'metamask',
    name: 'MetaMask',
    type: 'ANNOUNCED'
};
const AUTH_CONNECTOR = {
    id: 'ID_AUTH',
    type: 'AUTH',
    name: 'Auth',
    chain: 'eip155'
};
const mainnet = {
    id: 1,
    name: 'Ethereum',
    namespace: ConstantsUtil.CHAIN.EVM
};
beforeAll(() => {
    global.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});
describe('W3mConnectView - Connection Methods', () => {
    beforeEach(() => {
        vi.spyOn(CoreHelperUtil, 'isMobile').mockReturnValue(false);
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            enableWallets: true,
            features: {
                email: true,
                socials: ['google', 'facebook'],
                connectMethodsOrder: ['email', 'wallet', 'social'],
                collapseWallets: false
            }
        });
        vi.spyOn(ConnectorController, 'state', 'get').mockReturnValue({
            ...ConnectorController.state,
            connectors: [INSTALLED_WALLET, AUTH_CONNECTOR]
        });
        vi.spyOn(ChainController, 'state', 'get').mockReturnValue({
            ...ConnectorController.state,
            chains: new Map([
                [ConstantsUtil.CHAIN.EVM, { namespace: ConstantsUtil.CHAIN.EVM, caipNetworks: [mainnet] }]
            ])
        });
    });
    afterEach(() => {
        vi.clearAllMocks();
    });
    it('should render connection methods in specified order based on connectMethodsOrder option', async () => {
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        const children = Array.from(element.shadowRoot?.querySelector('.connect-methods')?.children ?? []);
        const widgets = children.map(child => child.tagName.toLowerCase());
        expect(widgets).toContain(WALLET_LOGIN_LIST);
        expect(widgets).toContain(EMAIL_LOGIN_WIDGET);
        expect(widgets).toContain(SOCIAL_LOGIN_WIDGET);
        expect(widgets.indexOf(EMAIL_LOGIN_WIDGET)).toBeLessThan(widgets.indexOf(WALLET_LOGIN_LIST));
        expect(widgets.indexOf(WALLET_LOGIN_LIST)).toBeLessThan(widgets.indexOf(SOCIAL_LOGIN_WIDGET));
    });
    it('should render connection methods in the correct order based on if there are installed wallets', async () => {
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            features: {
                email: true,
                socials: ['google', 'facebook']
            }
        });
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        const children = Array.from(element.shadowRoot?.querySelector('.connect-methods')?.children ?? []);
        const widgets = children.map(child => child.tagName.toLowerCase());
        expect(widgets).toContain(EMAIL_LOGIN_WIDGET);
        expect(widgets).toContain(WALLET_LOGIN_LIST);
        expect(widgets).toContain(SOCIAL_LOGIN_WIDGET);
        expect(widgets.indexOf(WALLET_LOGIN_LIST)).toBeLessThan(widgets.indexOf(EMAIL_LOGIN_WIDGET));
        expect(widgets.indexOf(EMAIL_LOGIN_WIDGET)).toBeLessThan(widgets.indexOf(SOCIAL_LOGIN_WIDGET));
    });
    it('should render "Continue with wallet" button when collapseWallets is true', async () => {
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            enableWallets: true,
            features: {
                email: true,
                socials: ['google'],
                connectMethodsOrder: ['wallet', 'email', 'social'],
                collapseWallets: true
            }
        });
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        const collapseButton = HelpersUtil.getByTestId(element, COLLAPSE_WALLETS_BUTTON);
        expect(collapseButton).not.toBeNull();
        expect(HelpersUtil.querySelect(element, WALLET_LOGIN_LIST)).toBeNull();
    });
    it('should render one separator between wallet and email/social group', async () => {
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            enableWallets: true,
            features: {
                email: true,
                socials: ['google'],
                connectMethodsOrder: ['wallet', 'email', 'social']
            }
        });
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        const separators = Array.from(element.shadowRoot?.querySelectorAll(SEPARATOR) ?? []);
        expect(separators.length).toBe(1);
    });
    it('should render one separator between wallet and social/email group', async () => {
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            features: {
                email: true,
                socials: ['google'],
                connectMethodsOrder: ['social', 'email', 'wallet']
            }
        });
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        const separators = Array.from(element.shadowRoot?.querySelectorAll(SEPARATOR) ?? []);
        expect(separators.length).toBe(1);
    });
    it('should render two separators between each method', async () => {
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            features: {
                email: true,
                socials: ['google'],
                connectMethodsOrder: ['email', 'wallet', 'social']
            }
        });
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        const separators = Array.from(element.shadowRoot?.querySelectorAll(SEPARATOR) ?? []);
        expect(separators.length).toBe(2);
    });
    it('should not render email widget when email is disabled', async () => {
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            features: {
                email: false,
                socials: ['google'],
                connectMethodsOrder: ['wallet', 'email', 'social']
            }
        });
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        expect(HelpersUtil.querySelect(element, EMAIL_LOGIN_WIDGET)).toBeNull();
        expect(HelpersUtil.querySelect(element, EMAIL_SEPARATOR)).toBeNull();
    });
    it('should not render social widget when socials are empty', async () => {
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            features: {
                email: true,
                socials: [],
                connectMethodsOrder: ['wallet', 'email', 'social']
            }
        });
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        expect(HelpersUtil.querySelect(element, SOCIAL_LOGIN_WIDGET)).toBeNull();
    });
    it('should not render wallet list when enableWallets is false', async () => {
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            enableWallets: false,
            features: {
                email: true,
                socials: ['google'],
                connectMethodsOrder: ['wallet', 'email', 'social']
            }
        });
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        expect(HelpersUtil.querySelect(element, WALLET_LOGIN_LIST)).toBeNull();
        expect(HelpersUtil.querySelect(element, COLLAPSE_WALLETS_BUTTON)).toBeNull();
    });
    it('should handle custom connection method order', async () => {
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            features: {
                email: true,
                socials: ['google'],
                connectMethodsOrder: ['social', 'email', 'wallet']
            }
        });
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        const children = Array.from(element.shadowRoot?.querySelector('.connect-methods')?.children ?? []);
        const widgets = children.map(child => child.tagName.toLowerCase());
        expect(widgets.indexOf(SOCIAL_LOGIN_WIDGET)).toBeLessThan(widgets.indexOf(EMAIL_LOGIN_WIDGET));
        expect(widgets.indexOf(EMAIL_LOGIN_WIDGET)).toBeLessThan(widgets.indexOf(WALLET_LOGIN_LIST));
    });
    it('should not render email nor social when there are no adapters', async () => {
        vi.mocked(ChainController.state).noAdapters = true;
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        expect(HelpersUtil.querySelect(element, EMAIL_LOGIN_WIDGET)).toBeNull();
        expect(HelpersUtil.querySelect(element, SOCIAL_LOGIN_WIDGET)).toBeNull();
    });
});
describe('W3mConnectView - Explore Mode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            features: {
                email: true,
                socials: ['google'],
                connectMethodsOrder: ['social', 'email', 'wallet']
            },
            enableWallets: false,
            enableWalletGuide: true
        });
        vi.mocked(ChainController.state).noAdapters = false;
    });
    it('should render a single separator in explore mode if wallet guide is enabled and there are adapters', async () => {
        const element = await fixture(html `<w3m-connect-view .walletGuide=${'explore'}></w3m-connect-view>`);
        const separators = element.shadowRoot?.querySelectorAll(SEPARATOR);
        expect(separators?.length).toBe(1);
        expect(HelpersUtil.querySelect(element, '#explore')).not.toBeNull();
    });
    it('should render no separators in explore mode if wallet guide is enabled and there are no adapters', async () => {
        vi.mocked(ChainController.state).noAdapters = true;
        const element = await fixture(html `<w3m-connect-view .walletGuide=${'explore'}></w3m-connect-view>`);
        const separators = element.shadowRoot?.querySelectorAll(SEPARATOR);
        expect(separators?.length).toBe(0);
        expect(HelpersUtil.querySelect(element, '#explore')).not.toBeNull;
    });
    it('should not render wallet list in explore mode', async () => {
        const element = await fixture(html `<w3m-connect-view .walletGuide=${'explore'}></w3m-connect-view>`);
        expect(HelpersUtil.querySelect(element, WALLET_LOGIN_LIST)).toBeNull();
    });
});
describe('W3mConnectView - Wallet Guide Mode', () => {
    beforeEach(() => {
        vi.mocked(ChainController.state).noAdapters = false;
    });
    it('should render wallet guide if enableWalletGuide is true', async () => {
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            features: {
                email: true,
                socials: ['google']
            },
            enableWalletGuide: true
        });
        const element = await fixture(html `<w3m-connect-view .walletGuide=${'get-started'}></w3m-connect-view>`);
        expect(HelpersUtil.querySelect(element, 'w3m-wallet-guide')).not.toBeNull();
    });
    it('should not render wallet guide if enableWalletGuide is false', async () => {
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            features: {
                email: true,
                socials: ['google']
            },
            enableWalletGuide: false
        });
        const element = await fixture(html `<w3m-connect-view .walletGuide=${'get-started'}></w3m-connect-view>`);
        expect(HelpersUtil.querySelect(element, 'w3m-wallet-guide')).toBeNull();
    });
});
describe('W3mConnectView - Email and Social Enable States', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(OptionsController, 'state', 'get').mockReturnValue({
            ...OptionsController.state,
            features: {
                email: true,
                socials: ['google'],
                connectMethodsOrder: ['social', 'email', 'wallet']
            }
        });
        vi.mocked(ChainController.state).noAdapters = false;
    });
    it('should disable email and social when noAdapters is true', async () => {
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        vi.mocked(ChainController.state).noAdapters = true;
        element['setEmailAndSocialEnableCheck'](element['features'], true);
        expect(element['isEmailEnabled']).toBe(false);
        expect(element['isSocialEnabled']).toBe(false);
    });
    it('should enable email and social when features are enabled and noAdapters is false', async () => {
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        element['setEmailAndSocialEnableCheck']({
            email: true,
            socials: ['google']
        }, false);
        expect(element['isEmailEnabled']).toBe(true);
        expect(element['isSocialEnabled']).toBe(true);
    });
    it('should disable email when email feature is disabled', async () => {
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        element['setEmailAndSocialEnableCheck']({
            email: false,
            socials: ['google']
        }, false);
        expect(element['isEmailEnabled']).toBe(false);
        expect(element['isSocialEnabled']).toBe(true);
    });
    it('should disable social when socials array is empty', async () => {
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        element['setEmailAndSocialEnableCheck']({
            email: true,
            socials: []
        }, false);
        expect(element['isEmailEnabled']).toBe(true);
        expect(element['isSocialEnabled']).toBe(false);
    });
    it('should handle undefined features', async () => {
        const element = await fixture(html `<w3m-connect-view></w3m-connect-view>`);
        element['setEmailAndSocialEnableCheck'](undefined, false);
        expect(element['isEmailEnabled']).toBe(undefined);
        expect(element['isSocialEnabled']).toBe(undefined);
    });
});
//# sourceMappingURL=w3m-connect-view.test.js.map