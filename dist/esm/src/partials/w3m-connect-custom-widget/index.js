var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ApiController, AssetUtil, ConnectionController, ConnectorController, CoreHelperUtil, OptionsController, RouterController, StorageUtil } from '@reown/appkit-core';
import { customElement } from '@reown/appkit-ui';
import { WalletUtil } from '../../utils/WalletUtil.js';
const COINBASE_WALLET_ID = 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa';
let W3mConnectCustomWidget = class W3mConnectCustomWidget extends LitElement {
    constructor() {
        super();
        this.unsubscribe = [];
        this.tabIdx = undefined;
        this.connectors = ConnectorController.state.connectors;
        this.loading = false;
        this.unsubscribe.push(ConnectorController.subscribeKey('connectors', val => (this.connectors = val)));
        if (CoreHelperUtil.isTelegram() && CoreHelperUtil.isIos()) {
            this.loading = !ConnectionController.state.wcUri;
            this.unsubscribe.push(ConnectionController.subscribeKey('wcUri', val => (this.loading = !val)));
        }
    }
    disconnectedCallback() {
        this.unsubscribe.forEach(unsubscribe => unsubscribe());
    }
    render() {
        const { customWallets } = OptionsController.state;
        const { featured } = ApiController.state;
        const featuredWallets = WalletUtil.filterOutDuplicateWallets(featured);
        const coinbaseWallet = featuredWallets.find(wallet => wallet.id === COINBASE_WALLET_ID);
        if (!customWallets?.length && !coinbaseWallet) {
            this.style.cssText = `display: none`;
            return null;
        }
        const wallets = this.filterOutDuplicateWallets(customWallets ?? []);
        return html `${wallets.length
            ? html `<wui-flex flexDirection="column" gap="xs">
          ${wallets.map(wallet => html `
              <wui-list-wallet
                imageSrc=${ifDefined(AssetUtil.getWalletImage(wallet))}
                name=${wallet.name ?? 'Unknown'}
                @click=${() => this.onConnectWallet(wallet)}
                data-testid=${`wallet-selector-${wallet.id}`}
                tabIdx=${ifDefined(this.tabIdx)}
                ?loading=${this.loading}
              >
              </wui-list-wallet>
            `)}
        </wui-flex>`
            : null}
    ${coinbaseWallet
            ? html `<wui-flex flexDirection="column" gap="xs">
          <wui-list-wallet
              data-testid=${`wallet-selector-featured-${coinbaseWallet.id}`}
              imageSrc=${ifDefined(AssetUtil.getWalletImage(coinbaseWallet))}
              name=${coinbaseWallet.name ?? 'Unknown'}
              @click=${() => this.onConnectWallet(coinbaseWallet)}
              tabIdx=${ifDefined(this.tabIdx)}
            >
        </wui-flex>`
            : null}`;
    }
    filterOutDuplicateWallets(wallets) {
        const recent = StorageUtil.getRecentWallets();
        const connectorRDNSs = this.connectors
            .map(connector => connector.info?.rdns)
            .filter(Boolean);
        const recentRDNSs = recent.map(wallet => wallet.rdns).filter(Boolean);
        const allRDNSs = connectorRDNSs.concat(recentRDNSs);
        if (allRDNSs.includes('io.metamask.mobile') && CoreHelperUtil.isMobile()) {
            const index = allRDNSs.indexOf('io.metamask.mobile');
            allRDNSs[index] = 'io.metamask';
        }
        const filtered = wallets.filter(wallet => !allRDNSs.includes(String(wallet?.rdns)));
        return filtered;
    }
    onConnectWallet(wallet) {
        if (this.loading) {
            return;
        }
        RouterController.push('ConnectingWalletConnect', { wallet });
    }
};
__decorate([
    property()
], W3mConnectCustomWidget.prototype, "tabIdx", void 0);
__decorate([
    state()
], W3mConnectCustomWidget.prototype, "connectors", void 0);
__decorate([
    state()
], W3mConnectCustomWidget.prototype, "loading", void 0);
W3mConnectCustomWidget = __decorate([
    customElement('w3m-connect-custom-widget')
], W3mConnectCustomWidget);
export { W3mConnectCustomWidget };
//# sourceMappingURL=index.js.map