import { elementUpdated, fixture } from '@open-wc/testing';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { html } from 'lit';
import { ConstantsUtil } from '@reown/appkit-common';
import { ApiController, ConnectionController, ConnectorController, CoreHelperUtil, RouterController } from '@reown/appkit-core';
import { W3mConnectInjectedWidget } from '../../src/partials/w3m-connect-injected-widget';
import { HelpersUtil } from '../utils/HelpersUtil';
const MOCK_INJECTED_CONNECTOR = {
    id: 'mockInjected',
    name: 'Mock Injected Wallet',
    type: 'INJECTED',
    info: {
        rdns: 'mock.injected.wallet'
    },
    provider: undefined,
    chain: ConstantsUtil.CHAIN.EVM
};
const BROWSER_WALLET_CONNECTOR = {
    id: 'browserWallet',
    name: 'Browser Wallet',
    type: 'INJECTED',
    provider: undefined,
    chain: ConstantsUtil.CHAIN.EVM
};
describe('W3mConnectInjectedWidget', () => {
    beforeAll(() => {
        vi.spyOn(CoreHelperUtil, 'isMobile').mockReturnValue(false);
    });
    beforeEach(() => {
        vi.spyOn(ApiController, 'state', 'get').mockReturnValue({
            ...ApiController.state,
            excludedRDNS: []
        });
        vi.spyOn(ConnectionController, 'checkInstalled').mockReturnValue(true);
    });
    afterEach(() => {
        vi.resetAllMocks();
    });
    it('should not render anything if there are no injected connectors', async () => {
        vi.spyOn(ConnectorController, 'state', 'get').mockReturnValue({
            ...ConnectorController.state,
            connectors: []
        });
        const element = await fixture(html `<w3m-connect-injected-widget></w3m-connect-injected-widget>`);
        expect(element.style.display).toBe('none');
    });
    it('should render injected connectors', async () => {
        vi.spyOn(ConnectorController, 'state', 'get').mockReturnValue({
            ...ConnectorController.state,
            connectors: [MOCK_INJECTED_CONNECTOR]
        });
        const element = await fixture(html `<w3m-connect-injected-widget></w3m-connect-injected-widget>`);
        element.requestUpdate();
        await elementUpdated(element);
        const walletSelector = HelpersUtil.getByTestId(element, `wallet-selector-${MOCK_INJECTED_CONNECTOR.id}`);
        expect(walletSelector).not.toBeNull();
        expect(walletSelector.getAttribute('name')).toBe(MOCK_INJECTED_CONNECTOR.name);
        expect(walletSelector.getAttribute('tagLabel')).toBe('installed');
        expect(walletSelector.getAttribute('tagVariant')).toBe('success');
    });
    it('should not render excluded RDNS wallets', async () => {
        vi.spyOn(ConnectorController, 'state', 'get').mockReturnValue({
            ...ConnectorController.state,
            connectors: [MOCK_INJECTED_CONNECTOR]
        });
        vi.spyOn(ApiController, 'state', 'get').mockReturnValue({
            ...ApiController.state,
            excludedRDNS: ['mock.injected.wallet']
        });
        const element = await fixture(html `<w3m-connect-injected-widget></w3m-connect-injected-widget>`);
        element.requestUpdate();
        await elementUpdated(element);
        const walletSelector = HelpersUtil.getByTestId(element, `wallet-selector-${MOCK_INJECTED_CONNECTOR.id}`);
        expect(walletSelector).toBeNull();
    });
    it('should not render Browser Wallet on desktop', async () => {
        vi.spyOn(ConnectorController, 'state', 'get').mockReturnValue({
            ...ConnectorController.state,
            connectors: [BROWSER_WALLET_CONNECTOR]
        });
        vi.spyOn(CoreHelperUtil, 'isMobile').mockReturnValue(false);
        const element = await fixture(html `<w3m-connect-injected-widget></w3m-connect-injected-widget>`);
        element.requestUpdate();
        await elementUpdated(element);
        const walletSelector = HelpersUtil.getByTestId(element, `wallet-selector-${BROWSER_WALLET_CONNECTOR.id}`);
        expect(walletSelector).toBeNull();
    });
    it('should render Browser Wallet on mobile', async () => {
        vi.spyOn(ConnectorController, 'state', 'get').mockReturnValue({
            ...ConnectorController.state,
            connectors: [BROWSER_WALLET_CONNECTOR]
        });
        vi.spyOn(CoreHelperUtil, 'isMobile').mockReturnValue(true);
        const element = await fixture(html `<w3m-connect-injected-widget></w3m-connect-injected-widget>`);
        element.requestUpdate();
        await elementUpdated(element);
        const walletSelector = HelpersUtil.getByTestId(element, `wallet-selector-${BROWSER_WALLET_CONNECTOR.id}`);
        expect(walletSelector).not.toBeNull();
    });
    it('should route to ConnectingExternal on connector click', async () => {
        vi.spyOn(ConnectorController, 'state', 'get').mockReturnValue({
            ...ConnectorController.state,
            connectors: [MOCK_INJECTED_CONNECTOR]
        });
        const setActiveConnectorSpy = vi.spyOn(ConnectorController, 'setActiveConnector');
        const pushSpy = vi.spyOn(RouterController, 'push');
        const element = await fixture(html `<w3m-connect-injected-widget></w3m-connect-injected-widget>`);
        const walletSelector = HelpersUtil.getByTestId(element, `wallet-selector-${MOCK_INJECTED_CONNECTOR.id}`);
        walletSelector.click();
        expect(setActiveConnectorSpy).toHaveBeenCalledWith(MOCK_INJECTED_CONNECTOR);
        expect(pushSpy).toHaveBeenCalledWith('ConnectingExternal', {
            connector: MOCK_INJECTED_CONNECTOR
        });
    });
    it('should handle unknown wallet names', async () => {
        const unknownConnector = {
            ...MOCK_INJECTED_CONNECTOR,
            name: undefined
        };
        vi.spyOn(ConnectorController, 'state', 'get').mockReturnValue({
            ...ConnectorController.state,
            connectors: [unknownConnector]
        });
        const element = await fixture(html `<w3m-connect-injected-widget></w3m-connect-injected-widget>`);
        const walletSelector = HelpersUtil.getByTestId(element, `wallet-selector-${unknownConnector.id}`);
        expect(walletSelector.getAttribute('name')).toBe('Unknown');
    });
    it('should not render when no RDNS and not installed', async () => {
        const noRdnsConnector = {
            ...MOCK_INJECTED_CONNECTOR,
            info: undefined
        };
        vi.spyOn(ConnectorController, 'state', 'get').mockReturnValue({
            ...ConnectorController.state,
            connectors: [noRdnsConnector]
        });
        vi.spyOn(ConnectionController, 'checkInstalled').mockReturnValue(false);
        const element = await fixture(html `<w3m-connect-injected-widget></w3m-connect-injected-widget>`);
        expect(element.style.display).toBe('none');
    });
});
//# sourceMappingURL=w3m-connect-injected-widget.test.js.map