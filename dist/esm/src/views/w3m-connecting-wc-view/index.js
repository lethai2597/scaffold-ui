var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { ChainController, ConnectionController, ConstantsUtil, CoreHelperUtil, EventsController, ModalController, OptionsController, RouterController, SnackController, StorageUtil } from '@reown/appkit-core';
import { customElement } from '@reown/appkit-ui';
let W3mConnectingWcView = class W3mConnectingWcView extends LitElement {
    constructor() {
        super();
        this.interval = undefined;
        this.lastRetry = Date.now();
        this.wallet = RouterController.state.data?.wallet;
        this.platform = undefined;
        this.platforms = [];
        this.isSiwxEnabled = Boolean(OptionsController.state.siwx);
        this.determinePlatforms();
        this.initializeConnection();
        this.interval = setInterval(this.initializeConnection.bind(this), ConstantsUtil.TEN_SEC_MS);
    }
    disconnectedCallback() {
        clearTimeout(this.interval);
    }
    render() {
        return html `
      ${this.headerTemplate()}
      <div>${this.platformTemplate()}</div>
    `;
    }
    async initializeConnection(retry = false) {
        if (this.platform === 'browser') {
            return;
        }
        try {
            const { wcPairingExpiry, status } = ConnectionController.state;
            if (retry || CoreHelperUtil.isPairingExpired(wcPairingExpiry) || status === 'connecting') {
                await ConnectionController.connectWalletConnect();
                this.finalizeConnection();
                if (!this.isSiwxEnabled) {
                    ModalController.close();
                }
            }
        }
        catch (error) {
            EventsController.sendEvent({
                type: 'track',
                event: 'CONNECT_ERROR',
                properties: { message: error?.message ?? 'Unknown' }
            });
            ConnectionController.setWcError(true);
            if (CoreHelperUtil.isAllowedRetry(this.lastRetry)) {
                SnackController.showError(error.message ?? 'Declined');
                this.lastRetry = Date.now();
                this.initializeConnection(true);
            }
            else {
                SnackController.showError(error.message ?? 'Connection error');
            }
        }
    }
    finalizeConnection() {
        const { wcLinking, recentWallet } = ConnectionController.state;
        if (wcLinking) {
            StorageUtil.setWalletConnectDeepLink(wcLinking);
        }
        if (recentWallet) {
            StorageUtil.setAppKitRecent(recentWallet);
        }
        EventsController.sendEvent({
            type: 'track',
            event: 'CONNECT_SUCCESS',
            properties: {
                method: wcLinking ? 'mobile' : 'qrcode',
                name: this.wallet?.name || 'Unknown'
            }
        });
    }
    determinePlatforms() {
        if (!this.wallet) {
            this.platforms.push('qrcode');
            this.platform = 'qrcode';
            return;
        }
        if (this.platform) {
            return;
        }
        const { mobile_link, desktop_link, webapp_link, injected, rdns } = this.wallet;
        const injectedIds = injected?.map(({ injected_id }) => injected_id).filter(Boolean);
        const browserIds = [...(rdns ? [rdns] : (injectedIds ?? []))];
        const isBrowser = OptionsController.state.isUniversalProvider ? false : browserIds.length;
        const isMobileWc = mobile_link;
        const isWebWc = webapp_link;
        const isBrowserInstalled = ConnectionController.checkInstalled(browserIds);
        const isBrowserWc = isBrowser && isBrowserInstalled;
        const isDesktopWc = desktop_link && !CoreHelperUtil.isMobile();
        if (isBrowserWc && !ChainController.state.noAdapters) {
            this.platforms.push('browser');
        }
        if (isMobileWc) {
            this.platforms.push(CoreHelperUtil.isMobile() ? 'mobile' : 'qrcode');
        }
        if (isWebWc) {
            this.platforms.push('web');
        }
        if (isDesktopWc) {
            this.platforms.push('desktop');
        }
        if (!isBrowserWc && isBrowser && !ChainController.state.noAdapters) {
            this.platforms.push('unsupported');
        }
        this.platform = this.platforms[0];
    }
    platformTemplate() {
        switch (this.platform) {
            case 'browser':
                return html `<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;
            case 'web':
                return html `<w3m-connecting-wc-web></w3m-connecting-wc-web>`;
            case 'desktop':
                return html `
          <w3m-connecting-wc-desktop .onRetry=${() => this.initializeConnection(true)}>
          </w3m-connecting-wc-desktop>
        `;
            case 'mobile':
                return html `
          <w3m-connecting-wc-mobile isMobile .onRetry=${() => this.initializeConnection(true)}>
          </w3m-connecting-wc-mobile>
        `;
            case 'qrcode':
                return html `<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`;
            default:
                return html `<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`;
        }
    }
    headerTemplate() {
        const multiPlatform = this.platforms.length > 1;
        if (!multiPlatform) {
            return null;
        }
        return html `
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `;
    }
    async onSelectPlatform(platform) {
        const container = this.shadowRoot?.querySelector('div');
        if (container) {
            await container.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 200,
                fill: 'forwards',
                easing: 'ease'
            }).finished;
            this.platform = platform;
            container.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 200,
                fill: 'forwards',
                easing: 'ease'
            });
        }
    }
};
__decorate([
    state()
], W3mConnectingWcView.prototype, "platform", void 0);
__decorate([
    state()
], W3mConnectingWcView.prototype, "platforms", void 0);
__decorate([
    state()
], W3mConnectingWcView.prototype, "isSiwxEnabled", void 0);
W3mConnectingWcView = __decorate([
    customElement('w3m-connecting-wc-view')
], W3mConnectingWcView);
export { W3mConnectingWcView };
//# sourceMappingURL=index.js.map